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
  importExistingBucket: true, // Bucket already exists — reference it, don't create
  enableCloudFront: false, // Set to true when ready for CDN
});
