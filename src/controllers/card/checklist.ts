import ChecklistModel from "@/models/card/checklist";
import CardModel from "@/models/card";

import type { RequestHandler } from "express";

export const createChecklist: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Cards - 卡片待辦"]
   * #swagger.description  = "創建待辦清單"
   */
  const { name, position } = req.body;

  const _result = await ChecklistModel.create({
    name,
    position,
    cardId: req.params.cardId,
  });

  const result = {
    ..._result.toObject(),
    checkItem: [],
  };

  const cardResult = await CardModel.findById(result?.cardId);
  if (cardResult) {
    res.app.emit(`boardId:${cardResult.boardId}`, cardResult);
  }
  res.send({ status: "success", result });
};

export const updateChecklist: RequestHandler = async (req, res) => {
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

  const cardResult = await CardModel.findById(result?.cardId);
  if (cardResult) {
    res.app.emit(`boardId:${cardResult.boardId}`, cardResult);
  }
  res.send({ status: "success", result });
};

export const deleteChecklist: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Cards - 卡片待辦"]
   * #swagger.description  = "刪除待辦清單"
   */
  const result = await ChecklistModel.findByIdAndDelete(req.params.checklistId);

  const cardResult = await CardModel.findById(result?.cardId);
  if (cardResult) {
    res.app.emit(`boardId:${cardResult.boardId}`, cardResult);
  }
  res.send({ status: "success", result });
};
