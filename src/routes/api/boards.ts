import { createRouter } from "@/shared";
import * as BoardController from "@/controllers/board";
import { checkRequestBodyValidator, isAuth } from "@/middlewares";

const router = createRouter();

export default router;

router.use(isAuth);

router.use(checkRequestBodyValidator);

router.get("/", BoardController.getAllBoards, () => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "取得組織所有看板"
   */
});

router.post("/", BoardController.createBoard, () => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "建立看板"
   */
});

router.get("/:boardId", BoardController.getBoardById, () => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "取得單一看板"
   */
});

router.put("/:boardId", BoardController.updateBoard, () => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "修改看板"
   */
});

router.delete("/:boardId", BoardController.deleteBoard, () => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "刪除看板"
   */
});

router.get(
  "/:boardId/invitationSecret",
  BoardController.getInvitationUrl,
  () => {
    /**
     * #swagger.tags = ["Boards - 看板"]
     * #swagger.description  = "取得看板邀請連結"
     */
  }
);

router.post(
  "/:boardId/invitationSecret",
  BoardController.createInvitationUrl,
  () => {
    /**
     * #swagger.tags = ["Boards - 看板"]
     * #swagger.description  = "建立看板邀請連結"
     */
  }
);

router.delete(
  "/:boardId/invitationSecret",
  BoardController.deleteInvitationUrl,
  () => {
    /**
     * #swagger.tags = ["Boards - 看板"]
     * #swagger.description  = "移除看板邀請連結"
     */
  }
);

router.get("/:boardId/labels", BoardController.getBoardLabels, () => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "取得標籤"
   */
});

router.post("/:boardId/labels", BoardController.createLabel, () => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "新增標籤"
   */
});

router.put("/:boardId/labels/:labelId", BoardController.updateLabel, () => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "修改標籤"
   */
});

router.delete("/:boardId/labels/:labelId", BoardController.deleteLabel, () => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "刪除標籤"
   */
});

router.post("/:boardId/members", BoardController.addBoardMember, () => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "新增多位看板成員"
   */
});

router.put(
  "/:boardId/members/:memberId",
  BoardController.updateBoardMember,
  () => {
    /**
     * #swagger.tags = ["Boards - 看板"]
     * #swagger.description  = "修改看板成員權限"
     */
  }
);

router.delete(
  "/:boardId/members/:memberId",
  BoardController.deleteBoardMember,
  () => {
    /**
     * #swagger.tags = ["Boards - 看板"]
     * #swagger.description  = "成員移除/退出看板"
     */
  }
);

router.get(
  "/:boardId/closedCardsAndList",
  BoardController.getClosedCardsAndList,
  () => {
    /**
     * #swagger.tags = ["Boards - 看板"]
     * #swagger.description  = "取得已封存列表/卡片"
     */
  }
);

router.post("/cloneById", BoardController.cloneBoardById, () => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "複製單一看板"
   */
});
