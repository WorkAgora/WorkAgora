import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { UserDTO } from '../../dtos/user/user.dto';
import { User, UserKey } from './user.interface';
import { CreateUserDTO } from '../../dtos/auth/create-user.dto';
import { UpdateFreelanceProfileDTO } from '../../dtos/user/update-freelance.dto';
import { UpdateEmployerProfileDTO } from '../../dtos/user/update-employer.dto';
import { SortOrder } from 'dynamoose/dist/General';

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
        return user;
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
      // @ts-ignore
      await this.model.create(user);
    } catch (error) {
      throw new UnprocessableEntityException(error, error.message);
    }
  }

  async updateFreelancerProfile(
    wallet: string,
    updatedProfile: UpdateFreelanceProfileDTO
  ): Promise<UserDTO> {
    const user = await this.findUserByWallet(wallet);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser: User = {
      ...user,
      ...updatedProfile,
      freelanceProfile: {
        ...(user.freelanceProfile || {}),
        ...(updatedProfile || {})
      }
    };

    // Save the updated user to the database
    await this.model.update(updatedUser);

    return updatedUser;
  }

  async updateEmployerProfile(
    wallet: string,
    updatedProfile: UpdateEmployerProfileDTO
  ): Promise<UserDTO> {
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

  /**
   * Change the user type
   * @param wallet
   * @param userType The new user type (freelance or company)
   * @returns The updated user
   */
  async changeUserType(wallet: string, userType: string): Promise<UserDTO> {
    const user = await this.findUserByWallet(wallet);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser: User = {
      ...user,
      currentUserType: userType
    };

    // Save the updated user to the database
    await this.model.update(updatedUser);

    return updatedUser;
  }

  /**
   * Search for users based on skill, name, etc.
   * @param searchTerm
   * @returns UserDTO[]
   */
  async searchUsers(searchTerm: string): Promise<UserDTO[]> {
    try {
      const users = await this.model.scan().exec();

      return users.filter((user) => {
        // Convert searchTerm and fields to lowercase for case-insensitive search
        const term = searchTerm.toLowerCase();
        return user.freelanceProfile?.skills.some((skill) => skill.toLowerCase().includes(term));

        // NOT FOR MVP
        // return (
        //   user.firstname?.toLowerCase().includes(term) ||
        //   user.lastname?.toLowerCase().includes(term) ||
        //   user.description?.toLowerCase().includes(term) ||
        //   user.location?.toLowerCase().includes(term) ||
        //   user.location?.toLowerCase().includes(term) ||
        //   user.freelanceProfile?.skills.some((skill) => skill.toLowerCase().includes(term)) ||
        //   user.freelanceProfile?.certificates.some((cert) => cert.toLowerCase().includes(term)) ||
        //   user.freelanceProfile?.situation?.toLowerCase().includes(term)
        // );
      });
    } catch (error) {
      throw new UnprocessableEntityException('Error while searching users', error.message);
    }
  }

  /**
   * Get recent freelancers
   * @param page Page number for pagination
   * @param limit Number of freelancers to return
   * @returns The list of recent freelancers
   */
  async getRecentFreelancers(
    page: number,
    limit: number
  ): Promise<{ data: UserDTO[]; lastEvaluatedKey: UserKey }> {
    try {
      let lastEvaluatedKey = null;

      // Loop until we have enough items for the requested page or we have exhausted all items
      try {
        for (let i = 0; i < page; ++i) {
          const result = await this.model
            .query('currentUserType')
            .eq('Freelancer')
            .using('FreelancerCreationIndex')
            .sort(SortOrder.descending)
            .startAt(lastEvaluatedKey)
            .limit(limit)
            .exec();

          if (result.lastKey) {
            lastEvaluatedKey = result.lastKey;
          } else {
            // If there's no more items, return whatever we have
            return { data: result, lastEvaluatedKey: null };
          }
        }
      } catch (error) {
        throw new UnprocessableEntityException(
          ('1-Error while getting recent freelancers' + error.message)
        );
      }

  console.log("BITE");
      console.log("Limit: " + limit);
      console.log("LastEvaluatedKey: " + lastEvaluatedKey);
      const users = await this.model
        .query('currentUserType')
        .eq('Freelancer')
        .using('FreelancerCreationIndex')
        .sort(SortOrder.descending)
        .startAt(lastEvaluatedKey)
        .limit(limit)
        .exec();

      console.log("UsersLength: " + users.length);

      return { data: users, lastEvaluatedKey };
    } catch (error) {
      console.error(error);
      throw new UnprocessableEntityException(
        '2-Error while getting recent freelancers',
        error.message
      );
    }
  }
}
