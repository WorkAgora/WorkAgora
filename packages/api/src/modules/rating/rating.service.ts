import { Injectable } from '@nestjs/common';
import {Rating, RatingKey} from './rating.interface';
import { RatingDTO } from '../../dtos/rating/rating.dto';
import {InjectModel, Model} from "nestjs-dynamoose";

@Injectable()
export class RatingService {
  constructor(
    @InjectModel('Rating')
    private readonly model: Model<Rating, RatingKey>
  ) {}

  async rateUser(ratingData: RatingDTO): Promise<Rating> {
    // Call smart contract function here and get the transaction hash
    const txHash = "function";

    // Create a new rating object with the transaction hash
    const rating: Rating = {
      wallet: ratingData.wallet,
      walletReceiver: ratingData.walletReceiver,
      stars: ratingData.stars,
      comment: ratingData.comment,
      txHash: txHash,
    };

    // Save the rating object to DDB
    await this.model.create(rating);

    return rating;
  }
}
