import { createRouter } from "@/shared";
import * as BoardController from "@/controllers/board";
import { checkRequestBodyValidator, isAuth } from "@/middlewares";

const router = createRouter();

export default router;

router.use(isAuth);

router.use(checkRequestBodyValidator);

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

router.post("/:boardId/members", BoardController.addBoardMember);

router.put("/:boardId/members/:memberId", BoardController.updateBoardMember);

router.delete("/:boardId/members/:memberId", BoardController.deleteBoardMember);

router.get(
  "/:boardId/closedCardsAndList",
  BoardController.getClosedCardsAndList
);
