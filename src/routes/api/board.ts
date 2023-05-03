import { createRouter } from "@/shared";
import * as BoardController from "@/controllers/board";
import { isAuth } from "@/middlewares";

export const path = "/boards";

export const router = createRouter();

// F1. 取得全部看板 (GET)
router.get("/", isAuth, BoardController.getBoards);
// F2. 建立看板 (POST)
router.post("/", isAuth, BoardController.createBoard);
// F3. 修改看板 (PUT)
router.put("/:boardID", isAuth, BoardController.updateBoard);
// F4. 刪除看板 (DELETE)
router.delete("/:boardID", isAuth, BoardController.deleteBoard);
// F5. 邀請看板成員 (POST)
router.post("/:boardID/invite", isAuth, BoardController.inviteToBoard);
// F6. 取得標籤 (GET)
router.get("/:boardID/labels", isAuth, BoardController.getLabels);
// F7. 新增標籤 (POST)
router.post("/:boardID/labels", isAuth, BoardController.createLabel);
// F8. 修改標籤 (PUT)
router.put("/:boardID/labels/:labelID", isAuth, BoardController.updateLabel);
// F9. 刪除標籤 (DELETE)
router.delete("/:boardID/labels/:labelID", isAuth, BoardController.deleteLabel);
// F10. 取得看板內所有成員 (GET)
router.get("/:boardID/members", isAuth, BoardController.getBoardUsers);
// F11. 移除/退出看板 (POST)
router.post("/:boardID/quit", isAuth, BoardController.quitBoard);
// F12. 取得已封存列表/卡片 (GET)
router.get("/:boardID/archive", isAuth, BoardController.getArchives);