import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const generateToken = (userId: string) => {
  return jwt.sign(
    { id: userId },
    env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
};