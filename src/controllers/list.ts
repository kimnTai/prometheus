import ListModel from "@/models/list";
import CardModel from "@/models/card";

import type { Request, Response } from "express";

export const createList = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["List - 列表"]
   */
  const { name, boardId, position } = req.body;

  const result = await ListModel.create({
    name,
    boardId,
    position,
  });

  res.send({ status: "success", result });
};

export const updateList = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["List - 列表"]
   */
  const { name, boardId, position, closed } = req.body;

  const result = await ListModel.findOneAndUpdate(
    { _id: req.params.listId },
    { name, boardId, position, closed },
    { new: true, runValidators: true }
  );

  if (!result) {
    throw new Error("無此貼文 id");
  }

  res.send({ status: "success", result });
};

export const deleteList = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["List - 列表"]
   */
  const result = await ListModel.findByIdAndDelete(req.params.listId);

  const cardResult = await CardModel.updateMany(
    {
      listId: req.params.listId,
    },
    {
      closed: true,
    }
  );

  if (!result) {
    throw new Error("無此貼文 id");
  }

  res.send({ status: "success", result: { result, cardResult } });
};

export const archiveAllCards = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["List - 列表"]
   */
  const result = await CardModel.updateMany(
    {
      listId: req.params.listId,
    },
    {
      closed: true,
    }
  );

  res.send({ status: "success", result });
};
