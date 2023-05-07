import { createRouter } from "@/shared";
import * as BoardController from "@/controllers/board";
import { isAuth } from "@/middlewares";

const router = createRouter();

export default router;

router.use(isAuth);

router.get("/", BoardController.getAllBoards);

router.post("/", BoardController.createBoard);

router.get("/:boardId", BoardController.getBoardById);

router.put("/:boardId", BoardController.updateBoard);

router.delete("/:boardId", BoardController.deleteBoard);

router.get("/:boardId/invitationSecret", BoardController.getInvitationUrl);

router.post("/:boardId/invitationSecret", BoardController.createInvitationUrl);

router.delete(
  "/:boardId/invitationSecret",
  BoardController.deleteInvitationUrl
);

router.get("/:boardId/labels", BoardController.getBoardLabels);

router.post("/:boardId/labels", BoardController.createLabel);

router.put("/:boardId/labels/:labelId", BoardController.updateLabel);

router.delete("/:boardId/labels/:labelId", BoardController.deleteLabel);

router.post("/:boardId/addBoardMember", BoardController.addBoardMember);

router.delete("/:boardId/quit", BoardController.quitBoard);

router.get("/:boardId/archive", BoardController.getArchives);
