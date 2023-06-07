import { createRouter } from "@/shared";
import * as EmailController from "@/controllers/email";
import { checkRequestBodyValidator } from "@/middlewares";

const router = createRouter();

export default router;

router.use(checkRequestBodyValidator);

router.post("/resetPassword", EmailController.sendResetPasswordEmail, () => {
  /**
   * #swagger.tags = ["Email"]
   * #swagger.description  = "重設密碼"
   */
});

router.get(
  "/emailVerification/:token",
  EmailController.emailVerification,
  () => {
    /**
     * #swagger.tags = ["Email"]
     * #swagger.description  = "email 驗證連結"
     */
  }
);

router.get(
  "/resendEmailVerification/:userId",
  EmailController.resendEmailVerification,
  () => {
    /**
     * #swagger.tags = ["Email"]
     * #swagger.description  = "重新發送 email 驗證"
     */
  }
);
