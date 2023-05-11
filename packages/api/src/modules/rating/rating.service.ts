import {HttpException, Injectable} from '@nestjs/common';
import {Rating, RatingKey} from './rating.interface';
import {RatingDTO} from '../../dtos/rating/rating.dto';
import {InjectModel, Model} from "nestjs-dynamoose";
import {NFTStorage} from "nft.storage";
import * as console from "console";
import {ethers} from "ethers";
import * as process from "process";
import {Blob} from "buffer";

@Injectable()
export class RatingService {
  constructor(@InjectModel('Rating') private readonly model: Model<Rating, RatingKey>) {
  }

  async rateUser(ratingData: RatingDTO): Promise<Rating> {
    const ratingFormatted = {
      wallet: ratingData.wallet.toLowerCase(),
      walletReceiver: ratingData.walletReceiver.toLowerCase(),
      stars: ratingData.stars,
      comment: ratingData.comment,
    }

    // Sign the rating data with your private key
    const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY);
    const signedMessage = await wallet.signMessage(JSON.stringify(ratingFormatted)).catch((e) => {
      throw new HttpException(`Error signing the message: ${e.message}`, e.status || 500);
    });

    let blob: Blob;
    try {
      blob = new Blob([`{"metadata": "${signedMessage}"`]);
    } catch (e) {
      throw new HttpException(`Error creating the blob: ${e.message}`, e.status || 500);
    }

    // Convert the signed message into a Blob and store it
    const {cid} = await NFTStorage.encodeBlob(blob).catch((e) => {
      console.error(`Error encoding the blob: ${e.message}`);
      throw new HttpException("2-" + e.message, e.status || 500);
    });

    // Create a new rating object with the cidIPFS
    const rating: Rating = {
      wallet: ratingData.wallet.toLowerCase(),
      walletReceiver: ratingData.walletReceiver.toLowerCase(),
      stars: ratingData.stars,
      comment: ratingData.comment,
      cidIPFS: JSON.stringify(cid)
    };

    // Save the rating object to DDB
    try {
      await this.model.create(rating);
    } catch (e) {
      throw new HttpException(`Error saving in DB: ${e.message}-${JSON.stringify(rating)}`, e.status || 500);
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
