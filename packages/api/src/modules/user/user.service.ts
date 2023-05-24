import { Injectable, UnprocessableEntityException, Logger } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { UserDTO } from '../../dtos/user/user.dto';
import { User, UserKey } from '@workagora/utils';
import { CreateUserDTO } from '../../dtos/auth/create-user.dto';
import { UpdateFreelanceProfileDTO } from '../../dtos/user/update-freelance.dto';
import { UpdateEmployerProfileDTO } from '../../dtos/user/update-employer.dto';
import { SortOrder } from 'dynamoose/dist/General';
import { UpdateProfileDTO } from '../../dtos/user/update-profile.dto';
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
      await this.model.create({
        ...user,
        hasFreelanceProfile: 'false',
        tosAcceptedOn: user.tosAcceptedOn.toString()
      });
    } catch (error) {
      throw new UnprocessableEntityException(error, error.message);
    }
  }

  async updateUserProfile(wallet: string, updatedProfile: UpdateProfileDTO): Promise<UserDTO> {
    const user = await this.findUserByWallet(wallet);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser: User = {
      ...user,
      ...updatedProfile
    };

    // Save the updated user to the database
    await this.model.update(updatedUser);

    return updatedUser;
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
      hasFreelanceProfile: (user.freelanceProfile != null).toString(),
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
   * Search users based on a search term
   * @param searchTerm The search term
   * @param page The page number
   * @param limit The number of results per page
   * @param wallet The wallet address of the user who is searching
   * @returns The list of users matching the search term
   * @throws UnprocessableEntityException
   */
  async searchUsers(
    searchTerm: string,
    page: number,
    limit: number,
    wallet?: string
  ): Promise<{ users: UserDTO[]; maxPage: number; totalResult: number }> {
    try {
      // Query users based on hasFreelanceProfile and sorted by createdAt
      let users = null;
      Logger.log(wallet);
      if (!wallet) {
        users = await this.model
          .query('hasFreelanceProfile')
          .eq('true')
          .using('HasFreelanceProfileIndex')
          .exec();
      } else {
        users = await this.model
          .query('hasFreelanceProfile')
          .eq('true')
          .where('wallet')
          .not()
          .eq(wallet.toLowerCase())
          .using('HasFreelanceProfileIndex')
          .exec();
      }

      const term = searchTerm ? searchTerm.toLowerCase() : '';
      const skillsArray = term.split(',');

      // Calculate score for each user
      users.forEach((user) => {
        let score = 0;
        if (user.freelanceProfile?.skills) {
          user.freelanceProfile.skills.forEach((skill) => {
            if (skillsArray.includes(skill.toLowerCase())) {
              score++;
            }
          });
        }
        user.score = score;
      });

      let filteredUsers = users;
      if (term !== '') {
        filteredUsers = users.filter((user) => user.score > 0);
        filteredUsers.sort((a, b) => b.score - a.score);
      } else {
        filteredUsers.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
      }

      const maxPage = Math.ceil(filteredUsers.length / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      return {
        users: filteredUsers.slice(startIndex, endIndex),
        maxPage: maxPage,
        totalResult: filteredUsers.length
      };
    } catch (error) {
      throw new UnprocessableEntityException('Error while searching users: ' + error.message);
    }
  }

  /**
   * Get recent freelancers
   * @param limit Number of freelancers to return
   * @returns The list of recent freelancers
   */
  async getRecentFreelancers(limit: number): Promise<UserDTO[]> {
    try {
      const users = await this.model
        .query('hasFreelanceProfile')
        .eq('true')
        .using('HasFreelanceProfileIndex')
        .sort(SortOrder.descending)
        .limit(limit)
        .exec();

      return users;
    } catch (error) {
      throw new UnprocessableEntityException(
        'Error while getting recent freelancers',
        error.message
      );
    }
  }
}
