import { createRouter } from "@/shared";
import * as EmailController from "@/controllers/email";
import { checkRequestBodyValidator } from "@/middlewares";

const router = createRouter();

export default router;

router.use(checkRequestBodyValidator);

router.post("/resetPassword", EmailController.sendResetPasswordEmail);

router.get("/emailVerification/:token", EmailController.emailVerification);

router.get(
  "/resendEmailVerification/:userId",
  EmailController.resendEmailVerification
);
