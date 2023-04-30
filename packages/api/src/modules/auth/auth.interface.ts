export interface AuthKey {
  id: string;
}

export interface Auth extends AuthKey {
  nonce: string;
  nonceTimeout: Date;
  wallet: string;
}
