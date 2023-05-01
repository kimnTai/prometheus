import ChecklistModel from "@/models/checklist";

import type { Request, Response } from "express";

export const createChecklist = async (req: Request, res: Response) => {
  const { name, position } = req.body;

  const result = await ChecklistModel.create({
    name,
    position,
    cardId: req.params.cardId,
  });

  res.send({ status: "success", result });
};

export const updateChecklist = async (req: Request, res: Response) => {
  const { name, position } = req.body;

  const result = await ChecklistModel.findByIdAndUpdate(
    req.params.checklistId,
    {
      name,
      position,
    },
    { new: true, runValidators: true }
  );

  res.send({ status: "success", result });
};

export const deleteChecklist = async (req: Request, res: Response) => {
  const result = await ChecklistModel.findByIdAndDelete(req.params.checklistId);

  res.send({ status: "success", result });
};
