#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { InfraStack } from '../lib/infra-stack';

const app = new cdk.App();

// Production stack — deploys to the eddysite bucket
new InfraStack(app, 'EddySiteStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT || '030125065667',
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  githubRepo: 'Eddyjim/eddy-site',
  bucketName: 'eddysite',
  importExistingBucket: true,
  enableCloudFront: true,
  domainName: 'eddyjim.com',
  certificateArn: 'arn:aws:acm:us-east-1:030125065667:certificate/9e42a475-91e7-4743-a9cf-e091609b0019',
  hostedZoneId: 'Z06096592PLH2V2D0UZJ8',
});
