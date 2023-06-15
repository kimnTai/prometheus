import DateModel from "@/models/card/date";
import CardModel from "@/models/card";

import type { RequestHandler } from "express";

export const createDate: RequestHandler = async (req, res) => {
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

  CardModel.findById(result?.cardId).then((cardResult) => {
    res.app.emit(`boardId:${cardResult?.boardId}`, cardResult);
  });
  res.send({ status: "success", result });
};

export const updateDate: RequestHandler = async (req, res) => {
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

  CardModel.findById(result?.cardId).then((cardResult) => {
    res.app.emit(`boardId:${cardResult?.boardId}`, cardResult);
  });
  res.send({ status: "success", result });
};

export const deleteDate: RequestHandler = async (req, res) => {
  const result = await DateModel.findOneAndDelete({
    cardId: req.params.cardId,
  });

  CardModel.findById(result?.cardId).then((cardResult) => {
    res.app.emit(`boardId:${cardResult?.boardId}`, cardResult);
  });
  res.send({ status: "success", result });
};
