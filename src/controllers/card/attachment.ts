import AttachmentModel from "@/models/card/attachment";
import CardModel from "@/models/card";

import type { RequestHandler } from "express";

export const createAttachment: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Cards - 卡片附件"]
   * #swagger.description  = "創建卡片附件"
   */
  const { dirname, filename } = req.body;

  const result = await AttachmentModel.create({
    dirname,
    filename,
    cardId: req.params.cardId,
    userId: req.user?._id,
  });

  const cardResult = await CardModel.findById(result?.cardId);
  if (cardResult) {
    res.app.emit(`boardId:${cardResult.boardId}`, cardResult);
  }
  res.send({ status: "success", result });
};

export const updateAttachment: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Cards - 卡片附件"]
   * #swagger.description  = "修改卡片附件"
   */
  const { dirname, filename } = req.body;

  const result = await AttachmentModel.findByIdAndUpdate(
    req.params.attId,
    {
      dirname,
      filename,
    },
    { new: true, runValidators: true }
  );

  const cardResult = await CardModel.findById(result?.cardId);
  if (cardResult) {
    res.app.emit(`boardId:${cardResult.boardId}`, cardResult);
  }
  res.send({ status: "success", result });
};

export const deleteAttachment: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Cards - 卡片附件"]
   * #swagger.description  = "刪除卡片附件"
   */
  const result = await AttachmentModel.findByIdAndDelete(req.params.attId);

  const cardResult = await CardModel.findById(result?.cardId);
  if (cardResult) {
    res.app.emit(`boardId:${cardResult.boardId}`, cardResult);
  }
  res.send({ status: "success", result });
};
