import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
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
          done(new Error("此 Email 已被註冊!"));
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

(() => {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    console.log("GITHUB_CLIENT_ID 或 GITHUB_CLIENT_SECRET 未設定!");
    return;
  }
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_LOGIN_CALL_BACK_URL,
      },
      async (...args: any[]) => {
        const [, , profile, done] = args;
        const { id: githubId, login, avatar_url, email } = profile._json;

        const user = await UsersModel.findOne({ githubId });
        if (user) {
          return done(null, user);
        }

        if (await UsersModel.findOne({ email })) {
          return done(new Error("此 Email 已被註冊!"));
        }

        const password = await bcrypt.hash(githubId, 12);
        const result = await UsersModel.create({
          name: login,
          email,
          password,
          githubId,
          avatar: avatar_url,
        });

        done(null, result);
      }
    )
  );
})();

export const authorizationCallback = async (req: Request, res: Response) => {
  /**
   * #swagger.ignore = true
   */
  if (!req.user) {
    throw new Error("loginCallback 錯誤!");
  }

  const params = new URLSearchParams({
    token: generateToken({ userId: req.user._id }),
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
  });

  res.redirect(`${process.env.CLIENT_LOGIN_CALLBACK_URL}?${params}`);
};

export const verifyToken = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Auth"]
   * #swagger.description  = "Verify the JWT token sent from the client"
   */
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
