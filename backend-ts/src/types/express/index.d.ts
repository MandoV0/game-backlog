import { User } from "../../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; email: string } & Partial<User>;
    }
  }
}
