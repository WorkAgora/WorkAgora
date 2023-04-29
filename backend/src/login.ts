import { APIGatewayProxyHandler } from 'aws-lambda';
import jwt from 'jsonwebtoken';
import { verifySIWE } from './utils/verifySIWE';
import { getUserByAddress } from './utils/database';

const JWT_SECRET: string = 'your_jwt_secret_here'; // TODO: Replace with our own secret

export const handler: APIGatewayProxyHandler = async (event) => {
    const { walletSignature, walletAddress } = JSON.parse(event.body || '{}');

    if (!walletSignature || !walletAddress) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing walletSignature or walletAddress' }),
        };
    }

    const recoveredAddress: string | null = await verifySIWE(walletSignature, walletAddress);

    if (recoveredAddress) {
        const user = await getUserByAddress(recoveredAddress);

        if (!user) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'User not registered' }),
            };
        }

        const token = jwt.sign({ walletAddress: recoveredAddress }, JWT_SECRET, { expiresIn: '7d' });

        return {
            statusCode: 200,
            body: JSON.stringify({ token }),
        };
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid wallet signature' }),
        };
    }
};
