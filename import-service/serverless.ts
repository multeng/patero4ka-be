import type {AWS} from '@serverless/typescript';

import {importProductsFile, importFileParser} from '@functions/index';

const serverlessConfiguration: AWS = {
    service: 'import-service',
    frameworkVersion: '2',
    plugins: ['serverless-esbuild'],
    useDotenv: true,
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        stage: 'dev',
        region: 'eu-west-1',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
            UPLOAD_BUCKET: '${env:UPLOAD_BUCKET}',
            SQS_URL: {
                Ref: 'catalogItemsQueue',
            }
        },
        lambdaHashingVersion: '20201221',
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: ['s3:ListBucket'],
                Resource: 'arn:aws:s3:::${env:UPLOAD_BUCKET}'
            },
            {
                Effect: 'Allow',
                Action: ['s3:*'],
                Resource: 'arn:aws:s3:::${env:UPLOAD_BUCKET}/*'
            },
            {
                Effect: 'Allow',
                Action: ['sqs:*'],
                Resource: {
                    'Fn::GetAtt': ['catalogItemsQueue', 'Arn']
                }
            }
        ]
    },
    resources: {
        Resources : {
            catalogItemsQueue: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    QueueName: 'catalogItemsQueue'
                }
            }
        },
        Outputs: {
            SQSArn: {
                Value: {
                    'Fn::GetAtt': ['catalogItemsQueue', 'Arn']
                }
            },
        }
    },
    // import the function via paths
    functions: {importProductsFile, importFileParser},
    package: {individually: true},
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: {'require.resolve': undefined},
            platform: 'node',
            concurrency: 10,
        },
    },
};

module.exports = serverlessConfiguration;
