import { getImageUrl } from "@/controllers/upload";
import { handleUploadFile } from "@/middlewares";
import { createRouter } from "@/shared";

export const path = "/upload";

export const router = createRouter();

router.post("/", handleUploadFile, getImageUrl);
