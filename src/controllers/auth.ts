import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import passport from "passport";
import bcrypt from "bcryptjs";
import { generateToken } from "@/shared";
import UsersModel from "@/models/user";

import type { RequestHandler } from "express";

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

        const password = await bcrypt.hash(googleId, 6);
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

        const password = await bcrypt.hash(githubId, 6);
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

export const authorizationCallback: RequestHandler = async (req, res) => {
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

  res.redirect(`${process.env.CLIENT_URL}/login/callback?${params}`);
};
