import { model } from 'dynamoose';
import { Item } from 'dynamoose/dist/Item';
import { UserSchema } from './user.schema';

export class User extends Item {
  id: string;
  wallet: string;
  email: string;
}

export const UserModel = model<User>('User', UserSchema);
