import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { generateToken } from "@/shared";
import UsersModel from "@/models/user";

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
  if (!req.user) {
    throw new Error("loginCallback 錯誤!");
  }

  const token = generateToken({ userId: req.user._id });

  const params = new URLSearchParams({
    token,
    name: req.user.name,
  });

  res.redirect(`${process.env.CLIENT_LOGIN_CALLBACK_URL}?${params}`);
};

// Verify the JWT token sent from the client
export const verifyToken = async (req: Request, res: Response) => {
  const CLIENT_ID_GOOGLE = process.env.GOOGLE_CLIENT_ID;
  const client = new OAuth2Client(CLIENT_ID_GOOGLE);
  const ticket = await client.verifyIdToken({
    idToken: req.body.token,
    audience: CLIENT_ID_GOOGLE,
  });
  const tokenPayload = ticket.getPayload();

  if (!tokenPayload) {
    throw new Error("tokenPayload 錯誤");
  }

  const result = await UsersModel.findOneAndUpdate(
    { googleId: tokenPayload.sub },
    {
      $setOnInsert: {
        name: tokenPayload.name,
        email: tokenPayload.email,
        password: await bcrypt.hash(tokenPayload.sub, 12),
        googleId: tokenPayload.sub,
        avatar: tokenPayload.picture,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  res.send({
    status: "success",
    token: generateToken({ userId: result._id }),
    result,
  });
};
