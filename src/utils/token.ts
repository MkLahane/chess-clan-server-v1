import { Response } from "express";
import { User } from "../entity/User";
import { sign } from "jsonwebtoken";
import { getConnection } from "typeorm";

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie("jid", token, {
    httpOnly: true,
    path: "/refresh_token",
  });
};

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "2m",
  });
};

export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );
};

export const revokeRefreshTokensForUser = async (userId: number) => {
  await getConnection()
    .getRepository(User)
    .increment({ id: userId }, "tokenVersion", 1);
};
