import AttachmentModel from "@/models/card/attachment";
import CardModel from "@/models/card";

import type { RequestHandler } from "express";

export const createAttachment: RequestHandler = async (req, res) => {
  const { dirname, filename } = req.body;

  const result = await AttachmentModel.create({
    dirname,
    filename,
    cardId: req.params.cardId,
    userId: req.user?._id,
  });

  CardModel.findById(result?.cardId).then((cardResult) => {
    res.app.emit(`boardId:${cardResult?.boardId}`, cardResult);
  });
  res.send({ status: "success", result });
};

export const updateAttachment: RequestHandler = async (req, res) => {
  const { dirname, filename } = req.body;

  const result = await AttachmentModel.findByIdAndUpdate(
    req.params.attId,
    {
      dirname,
      filename,
    },
    { new: true, runValidators: true }
  );

  CardModel.findById(result?.cardId).then((cardResult) => {
    res.app.emit(`boardId:${cardResult?.boardId}`, cardResult);
  });
  res.send({ status: "success", result });
};

export const deleteAttachment: RequestHandler = async (req, res) => {
  const result = await AttachmentModel.findByIdAndDelete(req.params.attId);

  CardModel.findById(result?.cardId).then((cardResult) => {
    res.app.emit(`boardId:${cardResult?.boardId}`, cardResult);
  });
  res.send({ status: "success", result });
};
