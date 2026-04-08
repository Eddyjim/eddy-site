import * as cdk from 'aws-cdk-lib/core';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';

interface EddySiteStackProps extends cdk.StackProps {
  /** GitHub org/repo for OIDC trust (e.g., "Eddyjim/eddy-site") */
  githubRepo: string;
  /** S3 bucket name for the website */
  bucketName: string;
  /** Whether to create a CloudFront distribution */
  enableCloudFront?: boolean;
  /** Import an existing bucket instead of creating a new one */
  importExistingBucket?: boolean;
  /** Custom domain name (e.g., "eddyjim.com") */
  domainName?: string;
  /** Existing ACM certificate ARN for the custom domain */
  certificateArn?: string;
  /** Existing Route53 hosted zone ID */
  hostedZoneId?: string;
}

export class InfraStack extends cdk.Stack {
  public readonly bucket: s3.IBucket;
  public readonly distribution?: cloudfront.Distribution;
  public readonly deployRole: iam.Role;

  constructor(scope: Construct, id: string, props: EddySiteStackProps) {
    super(scope, id, props);

    // ------------------------------------------------------------------
    // S3 Bucket — Static website hosting
    // ------------------------------------------------------------------
    if (props.importExistingBucket) {
      // Reference existing bucket (already created outside CDK)
      this.bucket = s3.Bucket.fromBucketName(this, 'WebsiteBucket', props.bucketName);
    } else {
      this.bucket = new s3.Bucket(this, 'WebsiteBucket', {
        bucketName: props.bucketName,
        websiteIndexDocument: 'index.html',
        websiteErrorDocument: 'index.html', // SPA fallback
        publicReadAccess: true,
        blockPublicAccess: new s3.BlockPublicAccess({
          blockPublicAcls: false,
          ignorePublicAcls: false,
          blockPublicPolicy: false,
          restrictPublicBuckets: false,
        }),
        removalPolicy: cdk.RemovalPolicy.RETAIN,
        autoDeleteObjects: false,
      });
    }

    // ------------------------------------------------------------------
    // CloudFront (optional) with custom domain support
    // ------------------------------------------------------------------
    if (props.enableCloudFront) {
      // Import existing ACM certificate if provided
      const certificate = props.certificateArn
        ? acm.Certificate.fromCertificateArn(this, 'Certificate', props.certificateArn)
        : undefined;

      this.distribution = new cloudfront.Distribution(this, 'CDN', {
        defaultBehavior: {
          origin: new origins.S3StaticWebsiteOrigin(this.bucket),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
        defaultRootObject: 'index.html',
        // Custom domain + SSL
        ...(props.domainName && certificate ? {
          domainNames: [props.domainName],
          certificate,
        } : {}),
        errorResponses: [
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: '/index.html', // SPA fallback
            ttl: cdk.Duration.minutes(5),
          },
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: '/index.html',
            ttl: cdk.Duration.minutes(5),
          },
        ],
      });

      // Route53 A record — only touches the A record, leaves MX/TXT/CNAME intact
      if (props.domainName && props.hostedZoneId) {
        const zone = route53.HostedZone.fromHostedZoneAttributes(this, 'Zone', {
          hostedZoneId: props.hostedZoneId,
          zoneName: props.domainName,
        });

        new route53.ARecord(this, 'SiteARecord', {
          zone,
          target: route53.RecordTarget.fromAlias(
            new targets.CloudFrontTarget(this.distribution),
          ),
          recordName: props.domainName,
        });
      }
    }

    // ------------------------------------------------------------------
    // GitHub OIDC Provider
    // ------------------------------------------------------------------
    const githubOidc = new iam.OpenIdConnectProvider(this, 'GitHubOidc', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
    });

    // ------------------------------------------------------------------
    // IAM Role for GitHub Actions deployment
    // ------------------------------------------------------------------
    this.deployRole = new iam.Role(this, 'GitHubActionsDeployRole', {
      roleName: 'github-actions-eddy-site',
      assumedBy: new iam.WebIdentityPrincipal(
        githubOidc.openIdConnectProviderArn,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          },
          StringLike: {
            'token.actions.githubusercontent.com:sub': `repo:${props.githubRepo}:*`,
          },
        },
      ),
      description: 'Role assumed by GitHub Actions for S3 deployment via OIDC',
    });

    // S3 deployment permissions
    this.bucket.grantReadWrite(this.deployRole);
    this.bucket.grantDelete(this.deployRole);

    // CloudFront invalidation permissions (if enabled)
    if (this.distribution) {
      this.deployRole.addToPolicy(
        new iam.PolicyStatement({
          actions: ['cloudfront:CreateInvalidation'],
          resources: [
            `arn:aws:cloudfront::${this.account}:distribution/${this.distribution.distributionId}`,
          ],
        }),
      );
    }

    // ------------------------------------------------------------------
    // Outputs
    // ------------------------------------------------------------------
    new cdk.CfnOutput(this, 'BucketName', {
      value: this.bucket.bucketName,
      description: 'S3 bucket name for website hosting',
    });

    if (!props.importExistingBucket) {
      new cdk.CfnOutput(this, 'BucketWebsiteUrl', {
        value: (this.bucket as s3.Bucket).bucketWebsiteUrl,
        description: 'S3 static website URL',
      });
    }

    new cdk.CfnOutput(this, 'DeployRoleArn', {
      value: this.deployRole.roleArn,
      description: 'IAM role ARN for GitHub Actions (set as AWS_ROLE_ARN secret)',
    });

    if (this.distribution) {
      new cdk.CfnOutput(this, 'CloudFrontDistributionId', {
        value: this.distribution.distributionId,
        description: 'CloudFront distribution ID (set as CLOUDFRONT_DISTRIBUTION_ID variable)',
      });

      new cdk.CfnOutput(this, 'CloudFrontUrl', {
        value: `https://${this.distribution.distributionDomainName}`,
        description: 'CloudFront distribution URL',
      });
    }
  }
}
