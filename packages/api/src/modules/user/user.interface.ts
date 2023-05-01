export interface UserKey {
  wallet: string;
}

export interface User extends UserKey {
  email: string;
}
