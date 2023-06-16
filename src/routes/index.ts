import { createRouter } from "@/shared";
import boards from "./api/boards";
import cards from "./api/cards";
import email from "./api/email";
import invitation from "./api/invitation";
import lists from "./api/lists";
import organizations from "./api/organizations";
import search from "./api/search";
import upload from "./api/upload";
import user from "./api/user";
import healthCheck from "./healthCheck";
import swagger from "./swagger";

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

routes.use("/api/invitation", invitation);
