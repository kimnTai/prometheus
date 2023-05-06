import { createRouter } from "@/shared";
import * as UserController from "@/controllers/user";
import { loginCallback, verifyToken } from "@/controllers/auth";
import { isAuth, checkRequestBodyValidator } from "@/middlewares";

import passport from "passport";

const router = createRouter();

export default router;

router.use(checkRequestBodyValidator);

router.get("/", isAuth, UserController.getAllUsers);

router.post("/register", UserController.register);

router.post("/login", UserController.login);

router.post("/resetPassword", isAuth, UserController.resetPassword);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  loginCallback
);

router.post("/google/verifyToken", verifyToken);

router.get("/verifyJwt", isAuth, UserController.verifyJwt);
