const generatePolicy = (principalId: string, resource: string, effect = 'Allow') => ({
    principalId,
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource,
            },
        ],
    },
});


const basicAuthorizer = async (event, _context, callback) => {
    const {authorizationToken, methodArn} = event;
    console.log('EVENT ', event);
    console.log('TOKEN: ', authorizationToken);
    console.log('METHOD ARN: ', methodArn);

    if (event['type'] !== 'TOKEN' || !authorizationToken) {
        callback('Unauthorized');
    }
    try {
        const encodedCreds = authorizationToken.split(' ')[1];
        const buff = Buffer.from(encodedCreds, 'base64');
        const plainCreds = buff.toString('utf-8').split(':');
        const username = plainCreds[0];
        const password = plainCreds[1];
        const storedUserPassword = process.env[username];

        const effect = !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';
        const policy = generatePolicy(encodedCreds, methodArn, effect);
        callback(null, policy);

    } catch (error) {
        console.log('AUTHORIZE ERROR :', error);
        callback('Unauthorized');
    }
}

export const main = basicAuthorizer;
