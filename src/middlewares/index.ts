import type { RequestHandler } from "express";
import multer from "multer";
import UsersModel from "@/models/user";
import { checkValidator, verifyToken } from "@/shared";

// token 驗證
export const isAuth: RequestHandler = async (req, _res, next) => {
  /**
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  const token = `${req.headers.authorization?.replace("Bearer ", "")}`;
  const result = verifyToken(token);

  const user = await UsersModel.findById(result.userId);
  if (!user) {
    throw new Error("token 錯誤");
  }
  req.user ??= user;

  next();
};

export const checkRequestBodyValidator: RequestHandler = (req, _res, next) => {
  checkValidator({ ...req.body });

  return next();
};

export const handleUploadFile: RequestHandler = (req, res, next) => {
  return multer({
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (_req, file, callback) => {
      // 只接受三種圖片格式
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        callback(new Error("圖片格式只接受 jpg、jpeg、png"));
        return;
      }
      callback(null, true);
    },
  }).single("image")(req, res, next);
};
