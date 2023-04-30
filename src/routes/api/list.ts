import * as ListController from "@/controllers/list";
import { createRouter } from "@/shared";

export const path = "/lists";

export const router = createRouter();

router.post("/", ListController.createList);

router.put("/:listId", ListController.updateList);

router.delete("/:listId", ListController.deleteList);

router.post("/:listId/archiveAllCards", ListController.archiveAllCards);
