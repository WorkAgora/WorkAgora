import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { v4 as uuidv4 } from 'uuid';
import { Auth, AuthKey } from './auth.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('Auth')
        private readonly model: Model<Auth, AuthKey>
    ) { }

    private async getAuthByWallet(wallet: string): Promise<Auth | null> {
        try {
            const auth = await this.model.query('wallet').eq(wallet).exec();
            return auth.count ? auth[0] : null;
        } catch (error) {
            console.error('Error getting auth by wallet:', error);
            return null;
        }
    }

    public async getNonce(wallet: string): Promise<string> {
        const existingAuth = await this.getAuthByWallet(wallet);
        const now = new Date();

        if (existingAuth && existingAuth.nonceTimeout > now) {
            return existingAuth.nonce;
        } else {
            if (existingAuth) {
                // Delete the expired nonce
                await this.model.delete({ id: existingAuth.id });
            }

            // Create a new nonce
            const createdAuth = await this.model.create({
                id: uuidv4(),
                wallet: wallet,
                nonce: uuidv4(),
                nonceTimeout: new Date(Date.now() + 30 * 60 * 1000),
            });

            // Return the generated nonce
            return createdAuth.nonce;
        }
    }
}
