import bcrypt from "bcryptjs";
import { generateToken, getWebsocketUrl } from "@/shared";
import UsersModel from "@/models/user";
import * as NotificationService from "@/service/notification";

import type { RequestHandler } from "express";

export const register: RequestHandler = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (await UsersModel.findOne({ email })) {
    throw new Error("此 Email 已被註冊!");
  }

  const _result = await UsersModel.create({
    name,
    email,
    password: await bcrypt.hash(password, 6),
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
  const password = await bcrypt.hash(req.body.password, 6);
  const result = await UsersModel.findByIdAndUpdate(req.body.userId, {
    password,
  });
  if (!result) {
    throw new Error("此 id 不存在");
  }
  res.send({ status: "success", message: "密碼重設成功" });
};

export const verifyJwt: RequestHandler = async (req, res) => {
  const token = `${req.headers.authorization?.replace("Bearer ", "")}`;
  res.send({
    status: "success",
    token,
    websocketUrl: getWebsocketUrl(req),
    result: req.user,
  });
};

export const updateProfile: RequestHandler = async (req, res) => {
  const result = await UsersModel.findByIdAndUpdate(
    req.body.userId,
    {
      name: req.body.name,
      avatar: req.body.avatar,
    },
    {
      new: true,
    }
  );
  if (!result) {
    throw new Error("此 id 不存在");
  }

  res.send({ status: "success", result });
};

export const getNotification: RequestHandler = async (req, res) => {
  const result = await NotificationService.getUserNotification({
    userId: req.user?.id,
  });

  res.send({ status: "success", result });
};

export const updateNotification: RequestHandler = async (req, res) => {
  const result = await NotificationService.updateOneNotification({
    notificationId: req.params.notificationId,
    isRead: req.body.isRead,
  });

  res.send({ status: "success", result });
};

export const deleteNotification: RequestHandler = async (req, res) => {
  const result = await NotificationService.deleteOneNotification({
    notificationId: req.params.notificationId,
  });

  res.send({ status: "success", result });
};
