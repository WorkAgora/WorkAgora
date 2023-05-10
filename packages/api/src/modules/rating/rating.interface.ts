export interface RatingKey {
  cidIPFS: string; // PK
}

export interface Rating extends RatingKey{
  stars: number;
  comment: string;
  walletReceiver: string;
  wallet: string; // SK
}
