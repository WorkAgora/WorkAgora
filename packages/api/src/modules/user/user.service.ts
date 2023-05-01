import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { UserDTO } from '../../dtos/user/user.dto';
import { User, UserKey } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly model: Model<User, UserKey>
  ) {}

  public async findUserByWallet(wallet: string): Promise<UserDTO> {
    //@TODO query model.kekchose et return UserDTO
    try {
      const response = await this.model.query('wallet').eq(wallet).exec();
      return { wallet: wallet, email: 'test@test.fr' };
    } catch (error) {
      throw new UnprocessableEntityException('Error while');
    }
  }
}
