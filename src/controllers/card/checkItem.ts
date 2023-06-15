import CheckItemModel from "@/models/card/checkItem";
import CardModel from "@/models/card";

import type { RequestHandler } from "express";

export const createCheckItem: RequestHandler = async (req, res) => {
  const { name, position } = req.body;

  const result = await CheckItemModel.create({
    name,
    position,
    checklistId: req.params.checklistId,
  });

  CardModel.findById(req.params.cardId).then((cardResult) => {
    res.app.emit(`boardId:${cardResult?.boardId}`, cardResult);
  });
  res.send({ status: "success", result });
};

export const updateCheckItem: RequestHandler = async (req, res) => {
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

  CardModel.findById(req.params.cardId).then((cardResult) => {
    res.app.emit(`boardId:${cardResult?.boardId}`, cardResult);
  });
  res.send({ status: "success", result });
};

export const deleteCheckItem: RequestHandler = async (req, res) => {
  const result = await CheckItemModel.findByIdAndDelete(req.params.checkItemId);

  CardModel.findById(req.params.cardId).then((cardResult) => {
    res.app.emit(`boardId:${cardResult?.boardId}`, cardResult);
  });
  res.send({ status: "success", result });
};
