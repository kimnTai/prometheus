import * as OrganizationController from "@/controllers/organization";
import { checkRequestBodyValidator, isAuth } from "@/middlewares";
import { createRouter } from "@/shared";

const router = createRouter();

export default router;

router.use(isAuth);

router.use(checkRequestBodyValidator);

router.post("/", OrganizationController.createOrganization, () => {
  /**
   * #swagger.tags = ["Organization - 組織"]
   * #swagger.description  = "新增組織"
   */
});

router.get("/user", OrganizationController.getUserOrganization, () => {
  /**
   * #swagger.tags = ["Organization - 組織"]
   * #swagger.description  = "取得會員所有組織"
   */
});

router.get(
  "/:organizationId",
  OrganizationController.getOneOrganizationById,
  () => {
    /**
     * #swagger.tags = ["Organization - 組織"]
     * #swagger.description  = "取得單一組織"
     */
  }
);

router.put(
  "/:organizationId",
  OrganizationController.updateOrganization,
  () => {
    /**
     * #swagger.tags = ["Organization - 組織"]
     * #swagger.description  = "修改組織"
     */
  }
);

router.delete(
  "/:organizationId",
  OrganizationController.deleteOrganization,
  () => {
    /**
     * #swagger.tags = ["Organization - 組織"]
     * #swagger.description  = "刪除組織"
     */
  }
);

router.post(
  "/:organizationId/invitationSecret",
  OrganizationController.createInviteOrganizationUrl,
  () => {
    /**
     * #swagger.tags = ["Organization - 組織"]
     * #swagger.description  = "建立組織邀請連結"
     */
  }
);

router.delete(
  "/:organizationId/invitationSecret",
  OrganizationController.deleteInviteOrganizationUrl,
  () => {
    /**
     * #swagger.tags = ["Organization - 組織"]
     * #swagger.description  = "移除組織邀請連結"
     */
  }
);

router.post(
  "/:organizationId/members",
  OrganizationController.addOrganizationMember,
  () => {
    /**
     * #swagger.tags = ["Organization - 組織"]
     * #swagger.description  = "新增多位組織成員"
     */
  }
);

router.put(
  "/:organizationId/members/:memberId",
  OrganizationController.updateOrganizationMember,
  () => {
    /**
     * #swagger.tags = ["Organization - 組織"]
     * #swagger.description  = "修改成員權限"
     */
  }
);

router.delete(
  "/:organizationId/members/:memberId",
  OrganizationController.deleteOrganizationMember,
  () => {
    /**
     * #swagger.tags = ["Organization - 組織"]
     * #swagger.description  = "移除組織成員"
     */
  }
);
