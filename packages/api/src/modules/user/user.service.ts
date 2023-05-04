import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { UserDTO } from '../../dtos/user/user.dto';
import { User, UserKey } from './user.interface';
import { CreateUserDTO } from '../../dtos/auth/create-user.dto';
import { UpdateFreelanceProfileDTO } from "../../dtos/user/update-freelance.dto";
import { UpdateEmployerProfileDTO } from "../../dtos/user/update-employer.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly model: Model<User, UserKey>
  ) {}

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
        return null;
      }
    } catch (error) {
      throw new UnprocessableEntityException('Error while querying the user', error.message);
    }
  }

  public async create(user: CreateUserDTO): Promise<void> {
    try {
      const userExist = await this.findUserByWallet(user.wallet);
      if (userExist) {
        throw new UnprocessableEntityException('User with this address already exist');
      }
      await this.model.create(user);
    } catch (error) {
      throw new UnprocessableEntityException(error, error.message);
    }
  }

  async updateFreelancerProfile(wallet: string, updatedProfile: UpdateFreelanceProfileDTO): Promise<UserDTO> {
    const user = await this.findUserByWallet(wallet);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser: User = {
      ...user,
      ...updatedProfile,
      workProfile: {
        ...(user.workProfile || {}),
        ...(updatedProfile || {})
      }
    };

    // Save the updated user to the database
    await this.model.update(updatedUser);

    return updatedUser;
  }

  async updateEmployerProfile(wallet: string, updatedProfile: UpdateEmployerProfileDTO): Promise<UserDTO> {
    const user = await this.findUserByWallet(wallet);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser: User = {
      ...user,
      ...updatedProfile,
      employerProfile: {
        ...(user.employerProfile || {}),
        ...(updatedProfile || {})
      }
    };

    // Save the updated user to the database
    await this.model.update(updatedUser);

    return updatedUser;
  }
}
