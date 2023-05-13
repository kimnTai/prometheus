import { createRouter } from "@/shared";
import * as ChecklistController from "@/controllers/card/checklist";
import * as CheckItemController from "@/controllers/card/checkItem";

const router = createRouter();

export default router;

router.post("/:cardId/checklist", ChecklistController.createChecklist);

router.put(
  "/:cardId/checklist/:checklistId",
  ChecklistController.updateChecklist
);

router.delete(
  "/:cardId/checklist/:checklistId",
  ChecklistController.deleteChecklist
);

router.post(
  "/:cardId/checklist/:checklistId/checkItem",
  CheckItemController.createCheckItem
);

router.put(
  "/:cardId/checklist/:checklistId/checkItem/:checkItemId",
  CheckItemController.updateCheckItem
);

router.delete(
  "/:cardId/checklist/:checklistId/checkItem/:checkItemId",
  CheckItemController.deleteCheckItem
);
