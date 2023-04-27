import { createRouter } from "@/shared";
import * as OrganizationController from "@/controllers/organization";
import { checkOrgExist, isAuth } from "@/middlewares";

export const path = "/organizations";

export const router = createRouter();

router.post("/", isAuth, OrganizationController.addOrganization);

router.get("/:orgID", checkOrgExist, OrganizationController.getOneOrganization);

router.put("/:orgID", OrganizationController.updateOrganization);

router.delete("/:orgID", OrganizationController.deleteOrganization);

router.post(
  "/:orgID/invitationSecret",
  OrganizationController.inviteOrganizationMember
);

router.get("/:orgID/members", OrganizationController.getAllMembers);

router.delete(
  "/:orgID/members/:memberID",
  OrganizationController.quitOrganization
);

router.put(
  "/:orgID/members/:memberID",
  OrganizationController.updateMemberRole
);
