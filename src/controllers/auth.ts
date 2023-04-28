import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UsersModel from "@/models/user";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { getJwtToken } from "./user";

import type { Request, Response } from "express";

(() => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log("GOOGLE_CLIENT_ID 或 GOOGLE_CLIENT_SECRET 未設定!");
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_LOGIN_CALL_BACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        const { sub: googleId, name, picture, email } = profile._json;

        const user = await UsersModel.findOne({ googleId });
        if (user) {
          return done(null, user);
        }

        if (await UsersModel.findOne({ email })) {
          throw new Error("此 Email 已被註冊!");
        }

        const password = await bcrypt.hash(googleId, 12);
        const result = await UsersModel.create({
          name,
          email,
          password,
          googleId,
          avatar: picture,
        });

        return done(null, result);
      }
    )
  );
})();

export const loginCallback = async (req: Request, res: Response) => {
  const { _id, name } = req.user as any;

  const token = jwt.sign({ userId: _id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });

  const params = new URLSearchParams({
    token,
    name,
  });

  res.send({ params, user: req.user });

  // TODO:前端跳轉邏輯
  // const url = "";
  // res.redirect(`${url}?${params}`);
};

// Verify the JWT token sent from the client
export const verifyToken = async (req: Request, res: Response) => {
  const token = req.body.token;
  const CLIENT_ID_GOOGLE = process.env.GOOGLE_CLIENT_ID;
  try {
    const client = new OAuth2Client(CLIENT_ID_GOOGLE);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID_GOOGLE,
    });
    const {
      sub: googleId,
      email,
      name,
      picture,
    } = ticket.getPayload() as TokenPayload;

    const user = await UsersModel.findOne({ googleId });
    console.log(user);
    if (!user) {
      const password = await bcrypt.hash(googleId, 12);
      const result = await UsersModel.create({
        name,
        email,
        password,
        googleId,
        avatar: picture,
      });
      return res.send({
        status: "success",
        token: getJwtToken(result._id),
        result,
      });
    }
    return res.send({
      status: "success",
      token: getJwtToken(user._id),
      result: user,
    });
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};
