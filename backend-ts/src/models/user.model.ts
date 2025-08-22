export interface User {
  userid: number;
  username: string;
  email: string;
  password_hash: string;
  created_at?: Date;
}