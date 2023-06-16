import * as ListController from "@/controllers/list";
import { checkRequestBodyValidator, isAuth } from "@/middlewares";
import { createRouter } from "@/shared";

const router = createRouter();

export default router;

router.use(isAuth);

router.use(checkRequestBodyValidator);

router.post("/", ListController.createList, () => {
  /**
   * #swagger.tags = ["List - 列表"]
   * #swagger.description  = "新增單一列表"
   */
});

router.put("/:listId", ListController.updateList, () => {
  /**
   * #swagger.tags = ["List - 列表"]
   * #swagger.description  = "修改單一列表"
   */
});

router.delete("/:listId", ListController.deleteList, () => {
  /**
   * #swagger.tags = ["List - 列表"]
   * #swagger.description  = "刪除單一列表"
   */
});

router.put("/:listId/archiveAllCards", ListController.archiveAllCards, () => {
  /**
   * #swagger.tags = ["List - 列表"]
   * #swagger.description  = "封存列表所有卡片"
   */
});

router.put(
  "/:listId/move",
  ListController.moveList,
  ListController.updateList,
  () => {
    /**
     * #swagger.tags = ["List - 列表"]
     * #swagger.description  = "移動列表"
     */
  }
);
