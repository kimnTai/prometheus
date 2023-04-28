import { checkValidator } from "@/shared";
import jwt, { type JwtPayload } from "jsonwebtoken";
import OrganizationModel from "@/models/organization";
import UsersModel from "@/models/user";

import type { Request, Response, NextFunction } from "express";

// token 身分驗證
export const isAuth = (req: Request, _res: Response, next: NextFunction) => {
  const token = `${req.headers.authorization?.replace("Bearer ", "")}`;
  const result = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

  if (!result.userId) {
    throw new Error("token 錯誤");
  }

  req.user ??= { userId: result.userId };

  checkValidator({ ...req.body });

  next();
};

// 使用者註冊檢查
export const checkRegister = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  checkValidator({ name, email, password });

  if (await UsersModel.findOne({ email })) {
    throw new Error("此 Email 已被註冊!");
  }

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

// 檢查組織是否存在
export const checkOrgExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orgID = req.params.orgID;

  const organization = await OrganizationModel.findById(orgID);
  if (!organization) {
    return res.status(404).json({ message: "Organization not found" });
  }

  return next();
};
