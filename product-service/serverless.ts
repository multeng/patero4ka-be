import type {AWS} from '@serverless/typescript';

import {getProducts, getProductById, addProduct, catalogBatchProcess} from "@functions/index";

const serverlessConfiguration: AWS = {
    service: 'product-service',
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
            PG_HOST: '${env:PG_HOST}',
            PG_DATABASE: '${env:PG_DATABASE}',
            PG_PORT: '${env:PG_PORT}',
            PG_USER: '${env:PG_USER}',
            PG_PASSWORD: '${env:PG_PASSWORD}',
            SNS_TOPIC_ARN: {
                Ref: 'CreateProductTopic',
            }
        },
        lambdaHashingVersion: '20201221',
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: ['sns:*'],
                Resource: {
                    Ref: 'CreateProductTopic',
                }
            }
        ]
    },
    resources: {
        Resources: {
            CreateProductTopic: {
                Type: 'AWS::SNS::Topic',
                Properties: {
                    TopicName: 'createProductTopic'
                }
            },
            CreateNotifyExpensiveProduct: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Endpoint: '${env:EXPENSIVE_EMAIL}',
                    Protocol: 'email',
                    TopicArn: {
                        Ref: 'CreateProductTopic'
                    },
                    FilterPolicy: {
                        price: [{numeric: ['>=', 100]}]
                    }
                }
            },
            CreateNotifyCheapProduct: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Endpoint: '${env:CHEAP_EMAIL}',
                    Protocol: 'email',
                    TopicArn: {
                        Ref: 'CreateProductTopic'
                    },
                    FilterPolicy: {
                        price: [{numeric: ['<', 100]}]
                    }
                }
            }
        }
    },
    // import the function via paths
    functions: {getProducts, getProductById, addProduct, catalogBatchProcess},
    package: {individually: true},
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk', 'pg-native'],
            target: 'node14',
            define: {'require.resolve': undefined},
            platform: 'node',
            concurrency: 10,
        },
    },
};

module.exports = serverlessConfiguration;
