import * as DateController from "@/controllers/card/date";
import { createRouter } from "@/shared";

const router = createRouter();

export default router;

router.post("/:cardId/date", DateController.createDate, () => {
  /**
   * #swagger.tags = ["Cards - 卡片日期"]
   * #swagger.description  = "創建卡片日期"
   */
});

router.put("/:cardId/date", DateController.updateDate, () => {
  /**
   * #swagger.tags = ["Cards - 卡片日期"]
   * #swagger.description  = "修改卡片日期"
   */
});

router.delete("/:cardId/date", DateController.deleteDate, () => {
  /**
   * #swagger.tags = ["Cards - 卡片日期"]
   * #swagger.description  = "刪除卡片日期"
   */
});
