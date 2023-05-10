import {HttpException, Injectable} from '@nestjs/common';
import {Rating, RatingKey} from './rating.interface';
import {RatingDTO} from '../../dtos/rating/rating.dto';
import {InjectModel, Model} from "nestjs-dynamoose";
import {NFTStorage} from "nft.storage";
import * as console from "console";
import {ethers} from "ethers";
import * as process from "process";
import {TokenInput} from "nft.storage/dist/src/lib/interface";
import {Blob} from "node:buffer";

@Injectable()
export class RatingService {
  constructor(
    @InjectModel('Rating')
    private readonly model: Model<Rating, RatingKey>
  ) {}

  async rateUser(ratingData: RatingDTO): Promise<Rating> {
    const ratingFormatted = {
      wallet: ratingData.wallet.toLowerCase(),
      walletReceiver: ratingData.walletReceiver.toLowerCase(),
      stars: ratingData.stars,
      comment: ratingData.comment,
    }

    // Initialize the NFTStorage client
    const client = new NFTStorage({ token: process.env.NFT_STORAGE_API_TOKEN })

    // Sign the rating data with your private key
    // const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY);
    // const signedMessage = await wallet.signMessage(JSON.stringify(ratingFormatted));


    try {
      const token: TokenInput = {
        name: "JobContract",
        description: "JobContract NFT",
        image: new Blob(['hello world'], {type:'text/plain'}),
        properties: {
          data: ratingFormatted,
          signature: "signedMessage",
        }
      }
    } catch (e) {
      console.error(`Error creating token: ${e.message}`);
      throw new HttpException("1-"+ e.message, e.status || 500);
    }

    // Convert the signed message into a Blob and store it
    // const {cid, car} = await NFTStorage.encodeNFT(token)
    // const storedCid = await client.storeCar(car);

    // Create a new rating object with the transaction hash
    const rating: Rating = {
      wallet: ratingData.wallet.toLowerCase(),
      walletReceiver: ratingData.walletReceiver.toLowerCase(),
      stars: ratingData.stars,
      comment: ratingData.comment,
      cidIPFS: "cid.toString()"
    };

    // console.log("JSON.stringify(rating): ", JSON.stringify(rating));
    // console.log("CID: ", cid.toString());


    // Save the rating object to DDB
    try {
      await this.model.create(rating);
    } catch (e) {
      throw new HttpException("end-"+ e.message + ":" + JSON.stringify(rating), e.status || 500);
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
