import type {AWS} from '@serverless/typescript';

import {getProducts, getProductById, addProduct} from "@functions/index";

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
            PG_PASSWORD: '${env:PG_PASSWORD}'
        },
        lambdaHashingVersion: '20201221',
    },
    // import the function via paths
    functions: {getProducts, getProductById, addProduct},
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
