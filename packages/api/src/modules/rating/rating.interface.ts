export interface RatingKey {
  walletReceiver: string; // PK
  wallet: string; // SK
}

export interface Rating extends RatingKey{
  stars: number;
  comment: string;
  txHash: string; // GSI
}
