import type { RequestHandler } from "express";
import CardModel from "@/models/card";
import ChecklistModel from "@/models/card/checklist";

export const createChecklist: RequestHandler = async (req, res) => {
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

  CardModel.findById(result?.cardId).then((cardResult) => {
    res.app.emit(`boardId:${cardResult?.boardId}`, cardResult);
  });
  res.send({ status: "success", result });
};

export const updateChecklist: RequestHandler = async (req, res) => {
  const { name, position } = req.body;

  const result = await ChecklistModel.findByIdAndUpdate(
    req.params.checklistId,
    {
      name,
      position,
    },
    { new: true, runValidators: true }
  );

  CardModel.findById(result?.cardId).then((cardResult) => {
    res.app.emit(`boardId:${cardResult?.boardId}`, cardResult);
  });
  res.send({ status: "success", result });
};

export const deleteChecklist: RequestHandler = async (req, res) => {
  const result = await ChecklistModel.findByIdAndDelete(req.params.checklistId);

  CardModel.findById(result?.cardId).then((cardResult) => {
    res.app.emit(`boardId:${cardResult?.boardId}`, cardResult);
  });
  res.send({ status: "success", result });
};
