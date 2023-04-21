import type { Request, Response, NextFunction } from "express";

// 初始化，捕捉全域錯誤
(() => {
  process.on("uncaughtException", (error) => {
    console.error("未捕獲的異常！");
    console.error(error);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("未捕捉到的 rejection :", promise, "原因：", reason);
  });
})();

export const sendNotFoundError = (_req: Request, res: Response) => {
  res.status(404).send({ status: "error", message: "無此路由資訊" });
};

export const catchCustomError = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if ("type" in err && err.type === "entity.parse.failed") {
    return res.status(400).send({ status: "error", message: err.type });
  }
  // 開發模式回傳錯誤訊息
  if (process.env?.NODE_ENV === "development") {
    return res.status(400).json({ status: "error", message: err.message, err });
  }
  return res.status(400).json({ status: "error", message: err.message });
};
