import { createRouter } from "@/shared";
import healthCheck from "./healthCheck";
import swagger from "./swagger";
import user from "./api/user";
import card from "./api/card";
import email from "./api/email";
import list from "./api/list";
import organization from "./api/organization";
import upload from "./api/upload";
import board from "./api/board";
import search from "./api/search";

const routes = createRouter();

export default routes;

routes.use(healthCheck);

routes.use(swagger);

routes.use("/api/user", user);

routes.use("/api/organizations", organization);

routes.use("/api/boards", board);

routes.use("/api/lists", list);

routes.use("/api/cards", card);

routes.use("/api/email", email);

routes.use("/api/upload", upload);

routes.use("/api/search", search);
