import { createRouter } from "@/shared";
import { searchMember } from "@/controllers/search";

const router = createRouter();

export default router;

router.get("/members", searchMember);
