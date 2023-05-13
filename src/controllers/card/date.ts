import DateModel from "@/models/date";

import type { Request, Response } from "express";

export const createDate = async (req: Request, res: Response) => {
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

  res.send({ status: "success", result });
};

export const updateDate = async (req: Request, res: Response) => {
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

  res.send({ status: "success", result });
};

export const deleteDate = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Cards - 卡片日期"]
   * #swagger.description  = "刪除卡片日期"
   */
  const result = await DateModel.findOneAndDelete({
    cardId: req.params.cardId,
  });

  res.send({ status: "success", result });
};
