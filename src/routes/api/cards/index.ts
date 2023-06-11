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

router.post("/", CardController.createCard, () => {
  /**
   * #swagger.tags = ["Cards - 卡片"]
   * #swagger.description  = "創建卡片"
   */
});

router.get("/:cardId", CardController.getCardById, () => {
  /**
   * #swagger.tags = ["Cards - 卡片"]
   * #swagger.description  = "取得單一卡片"
   */
});

router.put("/:cardId", CardController.updateCard, () => {
  /**
   * #swagger.tags = ["Cards - 卡片"]
   * #swagger.description  = "修改卡片"
   */
});

router.delete("/:cardId", CardController.deleteCard, () => {
  /**
   * #swagger.tags = ["Cards - 卡片"]
   * #swagger.description  = "刪除卡片"
   */
});

router.put("/:cardId/closed", CardController.closeCard, () => {
  /**
   * #swagger.tags = ["Cards - 卡片"]
   * #swagger.description  = "封存卡片"
   */
});

router.post("/:cardId/members", CardController.addCardMember, () => {
  /**
   * #swagger.tags = ["Cards - 卡片"]
   * #swagger.description  = "新增多位卡片成員"
   */
});

router.delete(
  "/:cardId/members/:memberId",
  CardController.deleteCardMember,
  () => {
    /**
     * #swagger.tags = ["Cards - 卡片"]
     * #swagger.description  = "移除卡片成員"
     */
  }
);

router.post("/:cardId/labels", CardController.addCardLabel, () => {
  /**
   * #swagger.tags = ["Cards - 卡片"]
   * #swagger.description  = "增加卡片標籤"
   */
});

router.delete(
  "/:cardId/labels/:labelId",
  CardController.deleteCardLabel,
  () => {
    /**
     * #swagger.tags = ["Cards - 卡片"]
     * #swagger.description  = "移除卡片標籤"
     */
  }
);

router.use(attachment);

router.use(checklist);

router.use(comments);

router.use(date);

router.post("/cloneById", CardController.cloneCardById, () => {
  /**
   * #swagger.tags = ["Cards - 卡片"]
   * #swagger.description  = "複製卡片"
   */
});
