import bcrypt from "bcryptjs";
import { generateToken, getWebsocketUrl } from "@/shared";
import UsersModel from "@/models/user";

import type { RequestHandler } from "express";

export const getAllUsers: RequestHandler = async (_req, res) => {
  /**
   * #swagger.tags = ["Users - 使用者"]
   * #swagger.description  = "取得所有使用者"
   * #swagger.ignore = true
   */
  const users = await UsersModel.find();
  res.send({ status: "success", result: users });
};

export const register: RequestHandler = async (req, res, next) => {
  /**
   * #swagger.tags = ["Users - 使用者"]
   * #swagger.description  = "帳號註冊"
   */
  const { name, email, password } = req.body;

  if (await UsersModel.findOne({ email })) {
    throw new Error("此 Email 已被註冊!");
  }

  const _result = await UsersModel.create({
    name,
    email,
    password: await bcrypt.hash(password, 12),
  });
  const { password: _, ...result } = _result.toObject();

  res.send({
    status: "success",
    token: generateToken({ userId: result._id }),
    websocketUrl: getWebsocketUrl(req),
    result,
  });

  next();
};

export const login: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Users - 使用者"]
   * #swagger.description  = "登入"
   */
  const { email, password } = req.body;

  const user = await UsersModel.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("此 Email 不存在!");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error("密碼錯誤!");
  }

  const { password: _, ...result } = user.toObject();

  res.send({
    status: "success",
    token: generateToken({ userId: user._id }),
    websocketUrl: getWebsocketUrl(req),
    result,
  });
};

export const resetPassword: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Users - 使用者"]
   * #swagger.description  = "重設密碼"
   */
  const password = await bcrypt.hash(req.body.password, 12);
  if (!(await UsersModel.findByIdAndUpdate(req.body.userId, { password }))) {
    throw new Error("此 id 不存在");
  }
  res.send({ status: "success", message: "密碼重設成功" });
};

export const verifyJwt: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Users - 使用者"]
   * #swagger.description  = "驗證登入"
   */
  const token = `${req.headers.authorization?.replace("Bearer ", "")}`;
  res.send({
    status: "success",
    token,
    websocketUrl: getWebsocketUrl(req),
    result: req.user,
  });
};
