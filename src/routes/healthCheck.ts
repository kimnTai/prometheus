import path from "path";
import { createRouter } from "@/shared";

const router = createRouter();

router.get("/", (req, res) => {
  const healthCheck = {
    status: "success",
    message: "OK",
    uptime: process.uptime(),
    timestamp: Date.now(),
    host: req.headers.host,
  };
  res.send(healthCheck);
});

router.get("/favicon.ico", (_, res) => {
  res.end();
});

router.get("/chat", (_, res) => {
  res.sendFile(path.resolve() + "/public/index.html");
});

export default router;
