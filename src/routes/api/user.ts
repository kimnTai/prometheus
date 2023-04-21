import { createRouter } from "@/shared";
import * as UserController from "@/controllers/user";

export const path = "/user";

export const router = createRouter();

router.get("/", UserController.getAllUsers);

router.post("/register", UserController.register);

router.post("/login", UserController.login);

router.post("/resetPassword", UserController.resetPassword);
