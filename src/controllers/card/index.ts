import CardModel from "@/models/card";
import ListModel from "@/models/list";

import type { RequestHandler } from "express";

export const createCard: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Cards - 卡片"]
   * #swagger.description  = "創建卡片"
   */
  const { name, listId, position } = req.body;

  const result = await CardModel.create({
    name,
    position,
    listId,
  });

  const boardId = (await ListModel.findById(listId))?.boardId;

  res.app.emit(`boardId:${boardId}`, result);
  res.send({ status: "success", result });
};

export const updateCard: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Cards - 卡片"]
   * #swagger.description  = "修改卡片"
   */
  const { name, listId, position, closed, description } = req.body;

  const result = await CardModel.findByIdAndUpdate(
    req.params.cardId,
    {
      name,
      listId,
      position,
      closed,
      description,
    },
    { new: true, runValidators: true }
  );

  if (!result) {
    throw new Error("無此卡片 id");
  }

  const boardId = (await ListModel.findById(listId))?.boardId;

  res.app.emit(`boardId:${boardId}`, result);
  res.send({ status: "success", result });
};

export const getCardById: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Cards - 卡片"]
   * #swagger.description  = "取得單一卡片"
   */
  const result = await CardModel.findById(req.params.cardId);

  if (!result) {
    throw new Error("無此卡片 id");
  }

  res.send({ status: "success", result });
};

export const deleteCard: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Cards - 卡片"]
   * #swagger.description  = "刪除卡片"
   */
  const result = await CardModel.findByIdAndDelete(req.params.cardId);

  // TODO:關聯卡片的修改

  if (!result) {
    throw new Error("無此卡片 id");
  }

  const boardId = (await ListModel.findById(result.listId))?.boardId;

  res.app.emit(`boardId:${boardId}`, result);
  res.send({ status: "success", result: result });
};

export const addCardMember: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Cards - 卡片"]
   * #swagger.description  = "新增卡片成員"
   */
  const result = await CardModel.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: {
        member: {
          userId: req.body.userId,
        },
      },
    },
    { new: true }
  );

  const boardId = (await ListModel.findById(result?.listId))?.boardId;

  res.app.emit(`boardId:${boardId}`, result);
  res.send({ status: "success", result });
};

export const deleteCardMember: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Cards - 卡片"]
   * #swagger.description  = "移除卡片成員"
   */
  const result = await CardModel.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: {
        member: {
          userId: req.params.memberId,
        },
      },
    },
    { new: true }
  );

  const boardId = (await ListModel.findById(result?.listId))?.boardId;

  res.app.emit(`boardId:${boardId}`, result);
  res.send({ status: "success", result });
};

export const addCardLabel: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Cards - 卡片"]
   * #swagger.description  = "增加卡片標籤"
   */
  const result = await CardModel.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: {
        label: req.params.labelId,
      },
    },
    { new: true }
  );

  const boardId = (await ListModel.findById(result?.listId))?.boardId;

  res.app.emit(`boardId:${boardId}`, result);
  res.send({ status: "success", result });
};

export const deleteCardLabel: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Cards - 卡片"]
   * #swagger.description  = "移除卡片標籤"
   */
  const result = await CardModel.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: {
        label: req.params.labelId,
      },
    },
    { new: true }
  );

  const boardId = (await ListModel.findById(result?.listId))?.boardId;

  res.app.emit(`boardId:${boardId}`, result);
  res.send({ status: "success", result });
};

export const closeCard: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Cards - 卡片"]
   * #swagger.description  = "封存卡片"
   */
  const result = await CardModel.findByIdAndUpdate(
    req.params.cardId,
    {
      closed: true,
    },
    { new: true, runValidators: true }
  );

  if (!result) {
    throw new Error("無此卡片 id");
  }

  const boardId = (await ListModel.findById(result?.listId))?.boardId;

  res.app.emit(`boardId:${boardId}`, result);
  res.send({ status: "success", result });
};
