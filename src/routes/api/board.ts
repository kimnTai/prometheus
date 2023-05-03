import { createRouter } from "@/shared";
import * as BoardController from "@/controllers/board";
import { isAuth } from "@/middlewares";

export const router = createRouter();

export default router;

router.get("/", isAuth, BoardController.getBoards);

router.post("/", isAuth, BoardController.createBoard);

router.put("/:boardID", isAuth, BoardController.updateBoard);

router.delete("/:boardID", isAuth, BoardController.deleteBoard);

router.post("/:boardID/invite", isAuth, BoardController.inviteToBoard);

router.get("/:boardID/labels", isAuth, BoardController.getLabels);

router.post("/:boardID/labels", isAuth, BoardController.createLabel);

router.put("/:boardID/labels/:labelID", isAuth, BoardController.updateLabel);

router.delete("/:boardID/labels/:labelID", isAuth, BoardController.deleteLabel);

router.get("/:boardID/members", isAuth, BoardController.getBoardUsers);

router.post("/:boardID/quit", isAuth, BoardController.quitBoard);

router.get("/:boardID/archive", isAuth, BoardController.getArchives);
