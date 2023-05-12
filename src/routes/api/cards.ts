import { createRouter } from "@/shared";
import { checkRequestBodyValidator, isAuth } from "@/middlewares";
import * as CardController from "@/controllers/card";
import * as AttachmentController from "@/controllers/card/attachment";
import * as ChecklistController from "@/controllers/card/checklist";
import * as CheckItemController from "@/controllers/card/checkItem";
import * as CommentController from "@/controllers/card/comment";
import * as DateController from "@/controllers/card/date";

const router = createRouter();

export default router;

router.use(isAuth);

router.use(checkRequestBodyValidator);

router.post("/", CardController.createCard);

router.get("/:cardId", CardController.getCardById);

router.put("/:cardId", CardController.updateCard);

router.delete("/:cardId", CardController.deleteCard);

router.post("/:cardId/closed", CardController.closeCard);

router.post("/:cardId/members", CardController.addCardMember);

router.delete("/:cardId/members/:memberId", CardController.deleteCardMember);

router.post("/:cardId/labels/:labelId", CardController.addCardLabel);

router.delete("/:cardId/labels/:labelId", CardController.deleteCardLabel);

router.post("/:cardId/attachments", AttachmentController.createAttachment);

router.put(
  "/:cardId/attachments/:attId",
  AttachmentController.updateAttachment
);

router.delete(
  "/:cardId/attachments/:attId",
  AttachmentController.deleteAttachment
);

router.post("/:cardId/checklist", ChecklistController.createChecklist);

router.put(
  "/:cardId/checklist/:checklistId",
  ChecklistController.updateChecklist
);

router.delete(
  "/:cardId/checklist/:checklistId",
  ChecklistController.deleteChecklist
);

router.post(
  "/:cardId/checklist/:checklistId/checkItem",
  CheckItemController.createCheckItem
);

router.put(
  "/:cardId/checklist/:checklistId/checkItem/:checkItemId",
  CheckItemController.updateCheckItem
);

router.delete(
  "/:cardId/checklist/:checklistId/checkItem/:checkItemId",
  CheckItemController.deleteCheckItem
);

router.post("/:cardId/comments", CommentController.createComment);

router.put("/:cardId/comments/:commentId", CommentController.updateComment);

router.delete("/:cardId/comments/:commentId", CommentController.deleteComment);

router.post("/:cardId/date", DateController.createDate);

router.put("/:cardId/date/:dateId", DateController.updateDate);

router.delete("/:cardId/date/:dateId", DateController.deleteDate);
