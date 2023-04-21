import UsersModel from "@/models/user";

import type { Request, Response } from "express";

// 新增使用者
export const createUser = async (req: Request, res: Response) => {
  const newUser = await UsersModel.create(req.body);
  res.status(201).json({ success: true, data: newUser });
};

// 取得所有使用者
export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await UsersModel.find();
  res.status(200).json({ success: true, data: users });
};

// 取得單一使用者
export const getUserById = async (req: Request, res: Response) => {
  const user = await UsersModel.findById(req.params.id);
  if (!user) {
    res.status(404).json({ success: false, error: "找不到使用者" });
  } else {
    res.status(200).json({ success: true, data: user });
  }
};

// 更新使用者資訊
export const updateUserById = async (req: Request, res: Response) => {
  const updatedUser = await UsersModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (!updatedUser) {
    res.status(404).json({ success: false, error: "找不到使用者" });
  } else {
    res.status(200).json({ success: true, data: updatedUser });
  }
};

// 刪除使用者
export const deleteUserById = async (req: Request, res: Response) => {
  const deletedUser = await UsersModel.findByIdAndDelete(req.params.id);
  if (!deletedUser) {
    res.status(404).json({ success: false, error: "找不到使用者" });
  } else {
    res.status(200).json({ success: true, data: deletedUser });
  }
};
