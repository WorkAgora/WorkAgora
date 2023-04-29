import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import {verifySIWE} from "./utils/verifySIWE";

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
    const { walletSignature, email } = JSON.parse(event.body || '{}');

    const walletAddress: string|null = verifySIWE(walletSignature, email);

    if (!walletAddress) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Invalid wallet signature',
            }),
        };
    }

    if (!email || !email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Invalid email',
            }),
        };
    }

    const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: 'Users',
        Item: {
            walletAddress,
            email,
        },
    };

    try {
        await dynamoDB.put(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Registration successful',
            }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error registering user',
            }),
        };
    }
};
