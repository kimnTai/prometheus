import { createRouter } from "@/shared";
import * as AttachmentController from "@/controllers/card/attachment";

const router = createRouter();

export default router;

router.post("/:cardId/attachments", AttachmentController.createAttachment);

router.put(
  "/:cardId/attachments/:attId",
  AttachmentController.updateAttachment
);

router.delete(
  "/:cardId/attachments/:attId",
  AttachmentController.deleteAttachment
);
