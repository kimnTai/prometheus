import passport from "passport";
import { createRouter } from "@/shared";
import * as UserController from "@/controllers/user";
import { authorizationCallback, verifyToken } from "@/controllers/auth";
import { isAuth, checkRequestBodyValidator } from "@/middlewares";
import * as EmailController from "@/controllers/email";

const router = createRouter();

export default router;

router.use(checkRequestBodyValidator);

router.get("/", isAuth, UserController.getAllUsers);

router.post(
  "/register",
  UserController.register,
  EmailController.sendEmailVerification
);

router.post("/login", UserController.login);

router.post("/resetPassword", isAuth, UserController.resetPassword);

router.get("/google", (...arg) => {
  /**
   * #swagger.tags = ["Auth"]
   */
  passport.authenticate("google", { scope: ["email", "profile"] })(...arg);
});

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authorizationCallback
);

router.get("/github", (...arg) => {
  /**
   * #swagger.tags = ["Auth"]
   */
  passport.authenticate("github", { scope: ["email", "profile"] })(...arg);
});

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  authorizationCallback
);

router.post("/google/verifyToken", verifyToken);

router.get("/verifyJwt", isAuth, UserController.verifyJwt);
