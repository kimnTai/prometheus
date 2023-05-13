import { createRouter } from "@/shared";
import * as CommentController from "@/controllers/card/comment";

const router = createRouter();

export default router;

router.post("/:cardId/comments", CommentController.createComment);

router.put("/:cardId/comments/:commentId", CommentController.updateComment);

router.delete("/:cardId/comments/:commentId", CommentController.deleteComment);
