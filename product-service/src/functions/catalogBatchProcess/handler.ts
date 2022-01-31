import {middyfy} from "@libs/lambda";
import {ProductService} from "../../services/product.service";
import {SNSClient, PublishCommand} from "@aws-sdk/client-sns";
import {DBConnect} from "@functions/DBConnect";

const snsClient = new SNSClient({region: 'eu-west-1'});


const catalogBatchProcess = async (event) => {
    const client = await DBConnect();
    const productService = new ProductService(client);
    try {
        for (const record of event.Records) {
            const product = JSON.parse(record.body);
            await productService.addProduct(product);
            const command = new PublishCommand({
                Subject: `${product.title} has been created`,
                Message: JSON.stringify(product),
                TopicArn: process.env.SNS_TOPIC_ARN,
                MessageAttributes: {
                    price: {
                        DataType: 'Number',
                        StringValue: `${product.price}`
                    }
                }
            })
            await snsClient.send(command);
        }
    } catch (error) {
        console.log("ERROR: ", error)
    } finally {
        client.end();
    }
}

export const main = middyfy(catalogBatchProcess);