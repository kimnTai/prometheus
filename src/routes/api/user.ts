import { createRouter } from "@/shared";
import * as UserController from "@/controllers/user";
import { checkRegister, checkLogin, checkResetPassword } from "@/middlewares";

import passport from "passport";
import { loginCallback } from "@/controllers/auth";

export const path = "/user";

export const router = createRouter();

router.get("/", UserController.getAllUsers);

router.post("/register", checkRegister, UserController.register);

router.post("/login", checkLogin, UserController.login);

router.post("/resetPassword", checkResetPassword, UserController.resetPassword);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  loginCallback
);
