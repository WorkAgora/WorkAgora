import {HttpException, Injectable} from '@nestjs/common';
import {Rating, RatingKey} from './rating.interface';
import {RatingDTO} from '../../dtos/rating/rating.dto';
import {InjectModel, Model} from "nestjs-dynamoose";
import * as console from "console";

@Injectable()
export class RatingService {
  constructor(
    @InjectModel('Rating')
    private readonly model: Model<Rating, RatingKey>
  ) {}

  async rateUser(ratingData: RatingDTO): Promise<Rating> {
    // Call smart contract function here and get the transaction hash
    const txHash = '0x' + Math.random().toString(16).substr(2, 64); // TODO change to real tx hash

    // Create a new rating object with the transaction hash
    const rating: Rating = {
      wallet: ratingData.wallet.toLowerCase(),
      walletReceiver: ratingData.walletReceiver.toLowerCase(),
      stars: ratingData.stars,
      comment: ratingData.comment,
      txHash: txHash,
    };


    // Save the rating object to DDB
    try {
      await this.model.create(rating);
    } catch (e) {
      throw new HttpException(e.message, e.status || 500);
    }

    return rating;
  }

  async getRatingsByWallet(wallet: string): Promise<RatingDTO[]> {
    try {
      return await this.model
        .scan("walletReceiver").eq(wallet.toLowerCase())
        .exec();
    } catch (e) {
      console.error(`Error querying ratings: ${e.message}`);
      throw new HttpException(e.message, e.status || 500);
    }
  }
}
