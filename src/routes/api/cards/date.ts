import { createRouter } from "@/shared";
import * as DateController from "@/controllers/card/date";

const router = createRouter();

export default router;

router.post("/:cardId/date", DateController.createDate);

router.put("/:cardId/date", DateController.updateDate);

router.delete("/:cardId/date", DateController.deleteDate);
