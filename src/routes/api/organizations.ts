import { createRouter } from "@/shared";
import * as OrganizationController from "@/controllers/organization";
import { checkRequestBodyValidator, isAuth } from "@/middlewares";

const router = createRouter();

export default router;

router.use(isAuth);

router.use(checkRequestBodyValidator);

router.post("/", OrganizationController.createOrganization);

router.get("/user", OrganizationController.getUserOrganization);

router.get("/:organizationId", OrganizationController.getOneOrganizationById);

router.put("/:organizationId", OrganizationController.updateOrganization);

router.delete("/:organizationId", OrganizationController.deleteOrganization);

router.post(
  "/:organizationId/invitationSecret",
  OrganizationController.inviteOrganizationMember
);

router.post(
  "/:organizationId/members",
  OrganizationController.addOrganizationMember
);

router.put(
  "/:organizationId/members/:memberId",
  OrganizationController.updateOrganizationMember
);

router.delete(
  "/:organizationId/members/:memberId",
  OrganizationController.deleteOrganizationMember
);
