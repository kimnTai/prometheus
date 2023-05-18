import { createRouter } from "@/shared";
import * as InvitationController from "@/controllers/invitation";
import { isAuth } from "@/middlewares";

const router = createRouter();

export default router;

router.use(isAuth);

router.post("/boards/:invitationToken", InvitationController.addBoardMember);

router.post(
  "/organizations/:invitationToken",
  InvitationController.addOrganizationMember
);
