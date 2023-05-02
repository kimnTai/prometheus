import { createRouter } from "@/shared";
import * as ListController from "@/controllers/list";

const router = createRouter();

export default router;

router.post("/", ListController.createList);

router.put("/:listId", ListController.updateList);

router.delete("/:listId", ListController.deleteList);

router.put("/:listId/archiveAllCards", ListController.archiveAllCards);
