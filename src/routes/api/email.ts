import { createRouter } from "@/shared";
import * as EmailController from "@/controllers/email";
import { checkRequestBodyValidator } from "@/middlewares";

export const path = "/email";

export const router = createRouter();

router.use(checkRequestBodyValidator);

router.post("/resetPassword", EmailController.sendResetPasswordEmail);

router.get("/emailVerification/:token", EmailController.emailVerification);

router.get(
  "/resendEmailVerification/:userId",
  EmailController.resendEmailVerification
);
