import { createRouter } from "@/shared";
import * as OrganizationController from "@/controllers/organization";
import { isAuth } from "@/middlewares";

const router = createRouter();

export default router;

router.post("/", isAuth, OrganizationController.createOrganization);

router.get("/user", isAuth, OrganizationController.getMemberOrganization);

router.get("/:organizationId", OrganizationController.getOneOrganizationById);

router.put("/:organizationId", OrganizationController.updateOrganization);

router.delete(
  "/:organizationId",
  isAuth,
  OrganizationController.deleteOrganization
);

router.post(
  "/:organizationId/invitationSecret",
  OrganizationController.inviteOrganizationMember
);

router.delete(
  "/:organizationId/members/:memberId",
  isAuth,
  OrganizationController.deleteOrganizationMember
);

router.put(
  "/:organizationId/members/:memberId",
  isAuth,
  OrganizationController.updateMemberRole
);
