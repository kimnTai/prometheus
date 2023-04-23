import { checkValidator } from "@/shared";
import jwt, { type JwtPayload } from "jsonwebtoken";

import type { Request, Response, NextFunction } from "express";

// token 身分驗證
export const isAuth = (req: Request, _res: Response, next: NextFunction) => {
  const token = `${req.headers.authorization?.replace("Bearer ", "")}`;
  const result = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  if (!result.userId) {
    throw new Error("token 錯誤");
  }

  if (req.method === "GET") {
    req.body.userId = result.userId;
    return next();
  }

  const { userId, ...args } = req.body;
  if (userId !== result.userId) {
    throw new Error("token 錯誤 userId 不一致");
  }

  checkValidator({ userId, ...args });

  next();
};

// 使用者註冊檢查
export const checkRegister = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  checkValidator({ name, email, password });

  next();
};

// 使用者登入檢查
export const checkLogin = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  checkValidator({ email, password });

  next();
};

// 使用者修改密碼檢查
export const checkResetPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, password } = req.body;

  checkValidator({ userId, password });

  isAuth(req, res, next);
};
