import * as AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const getUserByAddress = async (walletAddress: string) => {
    const params = {
        TableName: process.env.USERS_TABLE as string,
        Key: {
            walletAddress: walletAddress.toLowerCase(),
        },
    };

    try {
        const result = await dynamoDb.get(params).promise();
        return result.Item;
    } catch (error) {
        console.error('Error getting user by wallet address:', error);
        return null;
    }
};
