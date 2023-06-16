import { getImageUrl } from "@/controllers/upload";
import { handleUploadFile, isAuth } from "@/middlewares";
import { createRouter } from "@/shared";

const router = createRouter();

export default router;

router.use(isAuth);

router.post("/", handleUploadFile, getImageUrl, () => {
  /**
   * #swagger.tags = ["Other - 其它"]
   * #swagger.description  = "上傳圖片"
   * #swagger.consumes = ['multipart/form-data']  
     #swagger.parameters["image"] = {
        in: 'formData',
        type: 'file',
        required: 'true',
      } 
   */
});
