import { createRouter } from "@/shared";
import * as EmailController from "@/controllers/email";

export const path = "/email";

export const router = createRouter();

router.post("/resetPassword", EmailController.sendResetPasswordEmail);

router.get("/emailVerification/:token", EmailController.emailVerification);
