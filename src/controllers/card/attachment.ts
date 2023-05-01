import AttachmentModel from "@/models/attachment";

import type { Request, Response } from "express";

export const createAttachment = async (req: Request, res: Response) => {
  const { dirname, filename } = req.body;

  const result = await AttachmentModel.create({
    dirname,
    filename,
    cardId: req.params.cardId,
    userId: req.user?._id,
  });

  res.send({ status: "success", result });
};

export const updateAttachment = async (req: Request, res: Response) => {
  const { dirname, filename } = req.body;

  const result = await AttachmentModel.findByIdAndUpdate(
    req.params.attId,
    {
      dirname,
      filename,
    },
    { new: true, runValidators: true }
  );

  res.send({ status: "success", result });
};

export const deleteAttachment = async (req: Request, res: Response) => {
  const result = await AttachmentModel.findByIdAndDelete(req.params.attId);

  res.send({ status: "success", result });
};
