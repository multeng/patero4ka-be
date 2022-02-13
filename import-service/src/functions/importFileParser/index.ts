import {handlerPath} from '@libs/handlerResolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            s3: {
                bucket: 'pyatero4ka-storage',
                event: 's3:ObjectCreated:*',
                rules: [
                    {
                        prefix: 'uploaded/',
                    }
                ],
                existing: true,
            }
        }
    ]
}