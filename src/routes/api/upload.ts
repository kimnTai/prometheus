import { createRouter } from "@/shared";
import { getImageUrl } from "@/controllers/upload";
import { handleUploadFile } from "@/middlewares";

export const path = "/upload";

export const router = createRouter();

router.post("/", handleUploadFile, getImageUrl);
