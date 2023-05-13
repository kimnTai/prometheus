import { createRouter } from "@/shared";
import { checkRequestBodyValidator, isAuth } from "@/middlewares";
import * as CardController from "@/controllers/card";
import comments from "./comments";
import date from "./date";
import checklist from "./checklist";
import attachment from "./attachment";

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

router.use(attachment);

router.use(checklist);

router.use(comments);

router.use(date);
