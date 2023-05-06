import { createRouter } from "@/shared";
import * as ListController from "@/controllers/list";
import { isAuth } from "@/middlewares";

const router = createRouter();

export default router;

router.use(isAuth);

router.post("/", ListController.createList);

router.put("/:listId", ListController.updateList);

router.delete("/:listId", ListController.deleteList);

router.put("/:listId/archiveAllCards", ListController.archiveAllCards);
