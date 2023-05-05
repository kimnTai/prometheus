import bcrypt from "bcryptjs";
import UsersModel from "@/models/user";
import { sendEmailVerification } from "./email";

import type { Request, Response } from "express";
import { generateToken, verifyToken } from "@/shared";

// 取得所有使用者
export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await UsersModel.find();
  res.status(200).json({ status: "success", result: users });
};

// 帳號註冊
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (await UsersModel.findOne({ email })) {
    throw new Error("此 Email 已被註冊!");
  }

  const hashPassword = await bcrypt.hash(password, 12);

  sendEmailVerification(req, res);

  const _result = await UsersModel.create({
    name,
    email,
    password: hashPassword,
  });
  const { password: _, ...result } = _result.toObject();

  res.send({
    status: "success",
    token: generateToken({ userId: result._id }),
    result,
  });
};

// 登入
export const login = async (req: Request, res: Response) => {
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
    result,
  });
};

// 重設密碼
export const resetPassword = async (req: Request, res: Response) => {
  const password = await bcrypt.hash(req.body.password, 12);
  if (!(await UsersModel.findByIdAndUpdate(req.body.userId, { password }))) {
    throw new Error("此 id 不存在");
  }
  res.send({ status: "success", message: "密碼重設成功" });
};

//驗證登入
export const verifyAuth = async (req: Request, res: Response) => {
  //get token
  const authorization = req.headers.authorization;
  if (!authorization) {
    res.send({ status: "error", message: "未登入" });
  } else {
    const token = authorization.replace("Bearer ", "");

    const decoded = verifyToken(token);
    const user = await UsersModel.findOne({ _id: decoded.userId });
    res.send({ status: "success", token, result: user });
  }
};
