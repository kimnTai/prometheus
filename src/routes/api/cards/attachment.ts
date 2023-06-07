import { createRouter } from "@/shared";
import * as AttachmentController from "@/controllers/card/attachment";

const router = createRouter();

export default router;

router.post(
  "/:cardId/attachments",
  AttachmentController.createAttachment,
  () => [
    /**
     * #swagger.tags = ["Cards - 卡片附件"]
     * #swagger.description  = "創建卡片附件"
     */
  ]
);

router.put(
  "/:cardId/attachments/:attId",
  AttachmentController.updateAttachment,
  () => {
    /**
     * #swagger.tags = ["Cards - 卡片附件"]
     * #swagger.description  = "修改卡片附件"
     */
  }
);

router.delete(
  "/:cardId/attachments/:attId",
  AttachmentController.deleteAttachment,
  () => {
    /**
     * #swagger.tags = ["Cards - 卡片附件"]
     * #swagger.description  = "刪除卡片附件"
     */
  }
);
