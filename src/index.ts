import "reflect-metadata";
import "dotenv/config";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user-resolver";
import { ClanResolver } from "./resolvers/clan-resolver";
import { UserContext } from "./contexts/user-context";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "./utils/token";
import cors from "cors";
import cookieParser from "cookie-parser";

(async () => {
  await createConnection();
  const app = express();
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );
  app.use(cookieParser());
  app.get("/", (_, res) => res.send("hello"));
  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      return res.send({ ok: false, accessToken: "" });
    }

    // token is valid and
    // we can send back an access token
    const user = await User.findOne({ id: payload.userId });
    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }

    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, ClanResolver],
    }),
    context: ({ req, res }: UserContext) => ({ req, res }),
  });
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(8000, () => {
    console.log(`express server started`);
  });
})();
