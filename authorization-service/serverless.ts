import type {AWS} from '@serverless/typescript';

import {basicAuthorizer} from '@functions/index';

const serverlessConfiguration: AWS = {
    service: 'authorization-service',
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
            multeng: '${env:multeng}'
        },
        lambdaHashingVersion: '20201221',
    },
    resources: {
        Outputs: {
            BasicAuthorizerLambdaFunctionQualifiedArn: {
                Export: {
                    Name: {
                        'Fn::Sub': '${AWS::StackName}-BasicAuthorizerArn'
                    }
                }
            }
        }
    },
    // import the function via paths
    functions: {basicAuthorizer},
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
