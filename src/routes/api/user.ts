import passport from "passport";
import { createRouter } from "@/shared";
import * as UserController from "@/controllers/user";
import { authorizationCallback } from "@/controllers/auth";
import { isAuth, checkRequestBodyValidator } from "@/middlewares";
import * as EmailController from "@/controllers/email";

const router = createRouter();

export default router;

router.use(checkRequestBodyValidator);

router.post(
  "/register",
  UserController.register,
  EmailController.sendEmailVerification,
  () => {
    /**
     * #swagger.tags = ["Users - 使用者"]
     * #swagger.description  = "帳號註冊"
     */
  }
);

router.post("/login", UserController.login, () => {
  /**
   * #swagger.tags = ["Users - 使用者"]
   * #swagger.description  = "登入"
   */
});

router.post("/resetPassword", isAuth, UserController.resetPassword, () => {
  /**
   * #swagger.tags = ["Users - 使用者"]
   * #swagger.description  = "重設密碼"
   */
});

router.put("/updateProfile", isAuth, UserController.updateProfile, () => {
  /**
   * #swagger.tags = ["Users - 使用者"]
   * #swagger.description  = "更新使用者資訊"
   */
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
  () => {
    /**
     * #swagger.tags = ["Auth"]
     */
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authorizationCallback,
  () => {
    /**
     * #swagger.ignore = true
     */
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["email", "profile"] }),
  () => {
    /**
     * #swagger.tags = ["Auth"]
     */
  }
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  authorizationCallback,
  () => {
    /**
     * #swagger.ignore = true
     */
  }
);

router.get("/verifyJwt", isAuth, UserController.verifyJwt, () => {
  /**
   * #swagger.tags = ["Users - 使用者"]
   * #swagger.description  = "驗證登入"
   */
});

router.get("/notification", isAuth, UserController.getNotification, () => {
  /**
   * #swagger.tags = ["Users - 使用者"]
   * #swagger.description  = "取得使用者通知"
   */
});

router.put(
  "/notification/:notificationId",
  isAuth,
  UserController.updateNotification,
  () => {
    /**
     * #swagger.tags = ["Users - 使用者"]
     * #swagger.description  = "修改使用者通知"
     */
  }
);

router.delete(
  "/notification/:notificationId",
  isAuth,
  UserController.deleteNotification,
  () => {
    /**
     * #swagger.tags = ["Users - 使用者"]
     * #swagger.description  = "刪除使用者通知"
     */
  }
);
