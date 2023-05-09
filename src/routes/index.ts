import { createRouter } from "@/shared";
import healthCheck from "./healthCheck";
import swagger from "./swagger";
import user from "./api/user";
import organizations from "./api/organizations";
import boards from "./api/boards";
import lists from "./api/lists";
import cards from "./api/cards";
import email from "./api/email";
import upload from "./api/upload";
import search from "./api/search";

const routes = createRouter();

export default routes;

routes.use(healthCheck);

routes.use(swagger);

routes.use("/api/user", user);

routes.use("/api/organizations", organizations);

routes.use("/api/boards", boards);

routes.use("/api/lists", lists);

routes.use("/api/cards", cards);

routes.use("/api/email", email);

routes.use("/api/upload", upload);

routes.use("/api/search", search);
