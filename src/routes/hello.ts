import { createRouter } from "@/shared";

const router = createRouter();

router.get("/", (_, res) => {
  res.send("Hello Prometheus!");
});

router.get("/favicon.ico", (_, res) => {
  res.end();
});

export default router;
