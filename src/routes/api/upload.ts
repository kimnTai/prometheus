import { createRouter } from "@/shared";
import { getImageUrl } from "@/controllers/upload";
import { handleUploadFile, isAuth } from "@/middlewares";

const router = createRouter();

export default router;

router.use(isAuth);

router.post("/", handleUploadFile, getImageUrl);
