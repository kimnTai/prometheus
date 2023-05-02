import { createRouter } from "@/shared";
import healthCheck from "./healthCheck";
import swagger from "./swagger";
import user from "./api/user";
import card from "./api/card";
import email from "./api/email";
import list from "./api/list";
import organization from "./api/organization";
import upload from "./api/upload";

const routes = createRouter();

export default routes;

routes.use(healthCheck);

routes.use(swagger);

routes.use("/api/user", user);

routes.use("/api/cards", card);

routes.use("/api/email", email);

routes.use("/api/lists", list);

routes.use("/api/organizations", organization);

routes.use("/api/upload", upload);
