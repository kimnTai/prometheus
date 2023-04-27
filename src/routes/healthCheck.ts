import { createRouter } from "@/shared";

const router = createRouter();

router.get("/", (_, res) => {
  const healthCheck = {
    status: "success",
    message: "OK",
    uptime: process.uptime(),
    timestamp: Date.now(),
  };
  res.send(healthCheck);
});

router.get("/favicon.ico", (_, res) => {
  res.end();
});

export default router;
