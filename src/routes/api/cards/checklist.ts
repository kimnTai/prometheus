import { createRouter } from "@/shared";
import * as ChecklistController from "@/controllers/card/checklist";
import * as CheckItemController from "@/controllers/card/checkItem";

const router = createRouter();

export default router;

router.post("/:cardId/checklist", ChecklistController.createChecklist, () => {
  /**
   * #swagger.tags = ["Cards - 卡片待辦"]
   * #swagger.description  = "創建待辦清單"
   */
});

router.put(
  "/:cardId/checklist/:checklistId",
  ChecklistController.updateChecklist,
  () => {
    /**
     * #swagger.tags = ["Cards - 卡片待辦"]
     * #swagger.description  = "修改待辦清單"
     */
  }
);

router.delete(
  "/:cardId/checklist/:checklistId",
  ChecklistController.deleteChecklist,
  () => {
    /**
     * #swagger.tags = ["Cards - 卡片待辦"]
     * #swagger.description  = "刪除待辦清單"
     */
  }
);

router.post(
  "/:cardId/checklist/:checklistId/checkItem",
  CheckItemController.createCheckItem,
  () => {
    /**
     * #swagger.tags = ["Cards - 卡片待辦"]
     * #swagger.description  = "創建待辦事項"
     */
  }
);

router.put(
  "/:cardId/checklist/:checklistId/checkItem/:checkItemId",
  CheckItemController.updateCheckItem,
  () => {
    /**
     * #swagger.tags = ["Cards - 卡片待辦"]
     * #swagger.description  = "修改待辦事項"
     */
  }
);

router.delete(
  "/:cardId/checklist/:checklistId/checkItem/:checkItemId",
  CheckItemController.deleteCheckItem,
  () => {
    /**
     * #swagger.tags = ["Cards - 卡片待辦"]
     * #swagger.description  = "刪除待辦事項"
     */
  }
);
