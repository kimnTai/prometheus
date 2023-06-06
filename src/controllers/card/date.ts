import DateModel from "@/models/card/date";
import CardModel from "@/models/card";

import type { RequestHandler } from "express";

export const createDate: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Cards - 卡片日期"]
   * #swagger.description  = "創建卡片日期"
   */
  const { startDate, dueDate, dueReminder } = req.body;

  const result = await DateModel.findOneAndUpdate(
    {
      cardId: req.params.cardId,
    },
    {
      startDate,
      dueDate,
      dueReminder,
      cardId: req.params.cardId,
    },
    {
      // 如果沒有查詢到文檔，則創建新的文檔
      upsert: true,
      new: true,
      runValidators: true,
    }
  );

  const cardResult = await CardModel.findById(result?.cardId);
  if (cardResult) {
    res.app.emit(`boardId:${cardResult.boardId}`, cardResult);
  }
  res.send({ status: "success", result });
};

export const updateDate: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Cards - 卡片日期"]
   * #swagger.description  = "修改卡片日期"
   */
  const { startDate, dueDate, dueComplete, dueReminder } = req.body;

  const result = await DateModel.findOneAndUpdate(
    {
      cardId: req.params.cardId,
    },
    {
      startDate,
      dueDate,
      dueComplete,
      dueReminder,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  const cardResult = await CardModel.findById(result?.cardId);
  if (cardResult) {
    res.app.emit(`boardId:${cardResult.boardId}`, cardResult);
  }
  res.send({ status: "success", result });
};

export const deleteDate: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Cards - 卡片日期"]
   * #swagger.description  = "刪除卡片日期"
   */
  const result = await DateModel.findOneAndDelete({
    cardId: req.params.cardId,
  });

  const cardResult = await CardModel.findById(result?.cardId);
  if (cardResult) {
    res.app.emit(`boardId:${cardResult.boardId}`, cardResult);
  }
  res.send({ status: "success", result });
};
