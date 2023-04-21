import { createRouter } from "@/shared";
import { getAllUsers } from "@/controllers/user";

export const path = "/user";

export const router = createRouter();

router.get("/", getAllUsers);
