import { createRouter } from "@/shared";
import * as OrganizationController from "@/controllers/organization";
import { isAuth } from "@/middlewares";

const router = createRouter();

export default router;

router.use(isAuth);

router.post("/", OrganizationController.createOrganization);

router.get("/user", OrganizationController.getMemberOrganization);

router.get("/:organizationId", OrganizationController.getOneOrganizationById);

router.put("/:organizationId", OrganizationController.updateOrganization);

router.delete(
  "/:organizationId",
  OrganizationController.deleteOrganization
);

router.post(
  "/:organizationId/invitationSecret",
  OrganizationController.inviteOrganizationMember
);

router.delete(
  "/:organizationId/members/:memberId",
  OrganizationController.deleteOrganizationMember
);

router.put(
  "/:organizationId/members/:memberId",
  OrganizationController.updateMemberRole
);
