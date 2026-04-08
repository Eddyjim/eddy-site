# eddy-site

Personal portfolio and consultancy site built with Vue 3 + Vite, with an interactive CV and i18n support (EN/ES).

## Development

```sh
npm install
npm run dev
```

### Build for Production

```sh
npm run build
```

## Infrastructure (AWS CDK)

The site's AWS infrastructure is managed as code using CDK in the `infra/` directory.

### What it manages

- **S3 bucket** (`eddysite`) for static website hosting (imported, not created by CDK)
- **GitHub OIDC provider** for keyless authentication from GitHub Actions
- **IAM role** (`github-actions-eddy-site`) with S3 deploy permissions
- **CloudFront distribution** (optional, disabled by default)

### Prerequisites

- AWS CLI configured (`aws configure`)
- Node.js 18+
- CDK bootstrapped in the target account (one-time):

```sh
cd infra
npm install
npx cdk bootstrap
```

### Deploy infrastructure changes

```sh
cd infra
npm run build
npx cdk diff     # Preview changes
npx cdk deploy   # Apply changes
```

### Enable CloudFront

In `infra/bin/infra.ts`, set `enableCloudFront: true` and deploy:

```sh
cd infra
npm run build
npx cdk deploy
```

The stack outputs will include the CloudFront distribution ID and URL. Add the distribution ID as a `CLOUDFRONT_DISTRIBUTION_ID` variable in the GitHub environment.

## CI/CD Pipeline

The project uses GitHub Actions (`.github/workflows/ci-cd.yml`) with a GitFlow branching model.

### How it works

| Trigger | Action |
| ------- | ------ |
| PR to `develop` or `main` | Build validation only |
| Push to `develop` | Build validation only |
| Push to `release/*` | Build + deploy to **staging** S3 |
| Push to `main` | Build + deploy to **production** S3 |

### GitHub setup

1. **Environments**: Create `staging` and `production` in Settings > Environments
2. **Secrets** (per environment):

   | Secret | Value |
   | ------ | ----- |
   | `AWS_ROLE_ARN` | IAM role ARN from `npx cdk deploy` output (`DeployRoleArn`) |
   | `AWS_REGION` | `us-east-1` |
   | `S3_BUCKET_NAME` | Bucket name from `npx cdk deploy` output (`BucketName`) |

3. **Variables** (optional, per environment):

   | Variable | Value |
   | -------- | ----- |
   | `CLOUDFRONT_DISTRIBUTION_ID` | From `npx cdk deploy` output (only if CloudFront enabled) |

### Deployment flow

```
feature/* --> PR to develop --> build check
                  |
                  v
              develop (build validation only)
                  |
                  v
            release/* --> deploy to staging S3
                  |
                  v
               main --> deploy to production S3
```
