import CommentModel from "@/models/card/comment";
import CardModel from "@/models/card";

import type { RequestHandler } from "express";

export const createComment: RequestHandler = async (req, res) => {
  const _result = await CommentModel.create({
    comment: req.body.comment,
    cardId: req.params.cardId,
    userId: req.user?._id,
  });

  const result = await CommentModel.findById(_result._id);

  CardModel.findById(result?.cardId).then((cardResult) => {
    res.app.emit(`boardId:${cardResult?.boardId}`, cardResult);
  });
  res.send({ status: "success", result });
};

export const updateComment: RequestHandler = async (req, res) => {
  const result = await CommentModel.findByIdAndUpdate(
    req.params.commentId,
    {
      comment: req.body.comment,
    },
    { new: true, runValidators: true }
  );

  CardModel.findById(result?.cardId).then((cardResult) => {
    res.app.emit(`boardId:${cardResult?.boardId}`, cardResult);
  });
  res.send({ status: "success", result });
};

export const deleteComment: RequestHandler = async (req, res) => {
  const result = await CommentModel.findByIdAndDelete(req.params.commentId);

  CardModel.findById(result?.cardId).then((cardResult) => {
    res.app.emit(`boardId:${cardResult?.boardId}`, cardResult);
  });
  res.send({ status: "success", result });
};
