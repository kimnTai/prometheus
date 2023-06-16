import * as InvitationController from "@/controllers/invitation";
import { isAuth } from "@/middlewares";
import { createRouter } from "@/shared";

const router = createRouter();

export default router;

router.use(isAuth);

router.post(
  "/boards/:invitationToken",
  InvitationController.addBoardMember,
  () => {
    /**
     * #swagger.tags = ["Other - 其它"]
     * #swagger.description  = "透過邀請連結新增 - 看板成員"
     */
  }
);

router.post(
  "/organizations/:invitationToken",
  InvitationController.addOrganizationMember,
  () => {
    /**
     * #swagger.tags = ["Other - 其它"]
     * #swagger.description  = "透過邀請連結新增 - 組織成員"
     */
  }
);
