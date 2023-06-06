import CheckItemModel from "@/models/card/checkItem";
import CardModel from "@/models/card";

import type { RequestHandler } from "express";

export const createCheckItem: RequestHandler = async (req, res) => {
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

  const cardResult = await CardModel.findById(req.params.cardId);
  if (cardResult) {
    res.app.emit(`boardId:${cardResult.boardId}`, cardResult);
  }
  res.send({ status: "success", result });
};

export const updateCheckItem: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Cards - 卡片待辦"]
   * #swagger.description  = "修改待辦事項"
   */
  const { name, position, completed, checklistId } = req.body;

  const result = await CheckItemModel.findByIdAndUpdate(
    req.params.checkItemId,
    {
      name,
      position,
      completed,
      checklistId,
    },
    { new: true, runValidators: true }
  );

  const cardResult = await CardModel.findById(req.params.cardId);
  if (cardResult) {
    res.app.emit(`boardId:${cardResult.boardId}`, cardResult);
  }
  res.send({ status: "success", result });
};

export const deleteCheckItem: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Cards - 卡片待辦"]
   * #swagger.description  = "刪除待辦事項"
   */
  const result = await CheckItemModel.findByIdAndDelete(req.params.checkItemId);

  const cardResult = await CardModel.findById(req.params.cardId);
  if (cardResult) {
    res.app.emit(`boardId:${cardResult.boardId}`, cardResult);
  }
  res.send({ status: "success", result });
};
