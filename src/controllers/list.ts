import ListModel from "@/models/list";
import CardModel from "@/models/card";

import type { RequestHandler } from "express";

export const createList: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["List - 列表"]
   */
  const { name, boardId, position } = req.body;

  const result = await ListModel.create({
    name,
    boardId,
    position,
  });

  res.app.emit(`boardId:${result.boardId}`, result);
  res.send({ status: "success", result });
};

export const updateList: RequestHandler = async (req, res) => {
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
    throw new Error("無此列表 id");
  }

  res.app.emit(`boardId:${result.boardId}`, result);
  res.send({ status: "success", result });
};

export const deleteList: RequestHandler = async (req, res) => {
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
    throw new Error("無此列表 id");
  }

  res.app.emit(`boardId:${result.boardId}`, result);
  res.send({ status: "success", result: { result, cardResult } });
};

export const archiveAllCards: RequestHandler = async (req, res) => {
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
