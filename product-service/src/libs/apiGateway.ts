import type {APIGatewayProxyEvent, APIGatewayProxyResult, Handler} from "aws-lambda"
import type {FromSchema} from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

enum StatusCode {
    OK = 200,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export const formatJSONResponse = (response: Record<string, unknown>) => {
    return {
        statusCode: 200,
        body: JSON.stringify(response),
    }
}

export const successResponse = (data: any, statusCode = StatusCode.OK) => {
    return {
        statusCode,
        body: JSON.stringify(data, null, 2),
    }
}

export const errorResponse = (message: string, statusCode = StatusCode.INTERNAL_SERVER_ERROR) => {
    return {
        statusCode,
        body: JSON.stringify(message, null, 2),
    }
}

export const notFoundResponse = (message: string, statusCode = StatusCode.NOT_FOUND) => {
    return {
        statusCode,
        body: JSON.stringify(message, null, 2),
    }
}
