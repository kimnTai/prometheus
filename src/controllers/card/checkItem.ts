import CheckItemModel from "@/models/checkItem";

import type { Request, Response } from "express";

export const createCheckItem = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Cards - 卡片待辦"]
   * #swagger.description  = "創建待辦事項"
   */
  const { name, position } = req.body;

  const result = await CheckItemModel.create({
    name,
    position,
    checklistId: req.params.checklistId,
  });

  res.send({ status: "success", result });
};

export const updateCheckItem = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Cards - 卡片待辦"]
   * #swagger.description  = "修改待辦事項"
   */
  const { name, position, completed } = req.body;

  const result = await CheckItemModel.findByIdAndUpdate(
    req.params.checkItemId,
    {
      name,
      position,
      completed,
    },
    { new: true, runValidators: true }
  );

  res.send({ status: "success", result });
};

export const deleteCheckItem = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Cards - 卡片待辦"]
   * #swagger.description  = "刪除待辦事項"
   */
  const result = await CheckItemModel.findByIdAndDelete(req.params.checkItemId);

  res.send({ status: "success", result });
};
