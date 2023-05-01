export interface AuthKey {
  wallet: string;
}

export interface Auth extends AuthKey {
  nonce: string;
  nonceTimeout: Date;
}
