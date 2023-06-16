import { searchCards, searchMember } from "@/controllers/search";
import { isAuth } from "@/middlewares";
import { createRouter } from "@/shared";

const router = createRouter();

export default router;

router.get("/members", searchMember, () => {
  /**
   * #swagger.tags = ["Other - 其它"]
   * #swagger.description  = "搜尋成員"
   */
});

router.get("/cards", isAuth, searchCards, () => {
  /**
   * #swagger.tags = ["Other - 其它"]
   * #swagger.description  = "搜尋使用者卡片標題"
   */
});
