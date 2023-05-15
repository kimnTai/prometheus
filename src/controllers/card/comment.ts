import CommentModel from "@/models/card/comment";

import type { RequestHandler } from "express";

export const createComment: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Cards - 卡片留言"]
   * #swagger.description  = "創建卡片留言"
   */
  const result = await CommentModel.create({
    comment: req.body.comment,
    cardId: req.params.cardId,
    userId: req.user?._id,
  });

  res.send({ status: "success", result });
};

export const updateComment: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Cards - 卡片留言"]
   * #swagger.description  = "修改卡片留言"
   */
  const result = await CommentModel.findByIdAndUpdate(
    req.params.commentId,
    {
      comment: req.body.comment,
    },
    { new: true, runValidators: true }
  );

  res.send({ status: "success", result });
};

export const deleteComment: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Cards - 卡片留言"]
   * #swagger.description  = "刪除卡片留言"
   */
  const result = await CommentModel.findByIdAndDelete(req.params.commentId);

  res.send({ status: "success", result });
};
