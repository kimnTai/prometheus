import ChecklistModel from "@/models/card/checklist";

import type { Request, Response } from "express";

export const createChecklist = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Cards - 卡片待辦"]
   * #swagger.description  = "創建待辦清單"
   */
  const { name, position } = req.body;

  const result = await ChecklistModel.create({
    name,
    position,
    cardId: req.params.cardId,
  });

  res.send({ status: "success", result });
};

export const updateChecklist = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Cards - 卡片待辦"]
   * #swagger.description  = "修改待辦清單"
   */
  const { name, position } = req.body;

  const result = await ChecklistModel.findByIdAndUpdate(
    req.params.checklistId,
    {
      name,
      position,
    },
    { new: true, runValidators: true }
  );

  res.send({ status: "success", result });
};

export const deleteChecklist = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Cards - 卡片待辦"]
   * #swagger.description  = "刪除待辦清單"
   */
  const result = await ChecklistModel.findByIdAndDelete(req.params.checklistId);

  res.send({ status: "success", result });
};
