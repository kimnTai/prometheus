import { createRouter } from "@/shared";
import * as ListController from "@/controllers/list";

export const path = "/lists";

export const router = createRouter();

router.post("/", ListController.createList);

router.put("/:listId", ListController.updateList);

router.delete("/:listId", ListController.deleteList);

router.put("/:listId/archiveAllCards", ListController.archiveAllCards);
