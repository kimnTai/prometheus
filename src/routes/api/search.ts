import { createRouter } from "@/shared";

export const path = "/search";

export const router = createRouter();

router.get("/", (_req, res) => {
  res.send({ status: "success", message: "todo" });
});
