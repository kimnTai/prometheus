import { createRouter } from "@/shared";
import * as CommentController from "@/controllers/card/comment";

const router = createRouter();

export default router;

router.post("/:cardId/comments", CommentController.createComment, () => {
  /**
   * #swagger.tags = ["Cards - 卡片留言"]
   * #swagger.description  = "創建卡片留言"
   */
});

router.put(
  "/:cardId/comments/:commentId",
  CommentController.updateComment,
  () => {
    /**
     * #swagger.tags = ["Cards - 卡片留言"]
     * #swagger.description  = "修改卡片留言"
     */
  }
);

router.delete(
  "/:cardId/comments/:commentId",
  CommentController.deleteComment,
  () => {
    /**
     * #swagger.tags = ["Cards - 卡片留言"]
     * #swagger.description  = "刪除卡片留言"
     */
  }
);
