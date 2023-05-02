import { createRouter } from "@/shared";
import { getImageUrl } from "@/controllers/upload";
import { handleUploadFile } from "@/middlewares";

const router = createRouter();

export default router;

router.post("/", handleUploadFile, getImageUrl);
