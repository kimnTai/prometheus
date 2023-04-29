import { checkValidator } from "@/shared";
import jwt, { type JwtPayload } from "jsonwebtoken";
import OrganizationModel from "@/models/organization";
import UsersModel from "@/models/user";

import type { Request, Response, NextFunction } from "express";

// token 驗證
export const isAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token = `${req.headers.authorization?.replace("Bearer ", "")}`;
  const result = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

  const user = await UsersModel.findById(result.userId);
  if (!user) {
    throw new Error("token 錯誤");
  }
  req.user ??= user;

  next();
};

export const checkRequestBodyValidator = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  checkValidator({ ...req.body });

  return next();
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
