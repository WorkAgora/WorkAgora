import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { UserDTO } from '../../dtos/user/user.dto';
import { User, UserKey } from './user.interface';
import { CreateUserDTO } from '../../dtos/auth/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly model: Model<User, UserKey>
  ) { }

  public async findUserByWallet(wallet: string): Promise<UserDTO> {
    try {
      // DynamoDB query to find the user with the given wallet address
      const response = await this.model.query('wallet').eq(wallet).exec();

      // Check if a user was found
      if (response.count > 0) {
        const user: User = response[0];

        // Return the found user as a UserDTO
        return { wallet: user.wallet, email: user.email };
      } else {
        throw new UnprocessableEntityException('User not found');
      }
    } catch (error) {
      throw new UnprocessableEntityException('Error while querying the user', { cause: error });
    }
  }

  public async create(user: CreateUserDTO): Promise<User> {
    try {
      const newUser = await this.model.create(user);
      return newUser;
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
