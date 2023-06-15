import ListModel from "@/models/list";
import CardModel from "@/models/card";

import type { RequestHandler } from "express";

export const createList: RequestHandler = async (req, res) => {
  const { name, boardId, position } = req.body;

  const _result = await ListModel.create({
    name,
    boardId,
    position,
  });

  const result = {
    ..._result.toObject(),
    card: [],
  };

  res.app.emit(`boardId:${result.boardId}`, result);
  res.send({ status: "success", result });
};

export const updateList: RequestHandler = async (req, res) => {
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
  await CardModel.updateMany(
    {
      listId: req.params.listId,
    },
    {
      closed: true,
    },
    {
      new: true,
    }
  );

  const result = await ListModel.findById(req.params.listId);

  res.app.emit(`boardId:${result?.boardId}`, result);
  res.send({ status: "success", result });
};
