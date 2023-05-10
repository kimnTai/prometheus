import CardModel from "@/models/card";
import ListModel from "@/models/list";

import type { Request, Response } from "express";

export const createCard = async (req: Request, res: Response) => {
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

export const updateCard = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Cards - 卡片"]
   * #swagger.description  = "修改卡片"
   */
  const { name, listId, position, closed } = req.body;

  const result = await CardModel.findByIdAndUpdate(
    req.params.cardId,
    {
      name,
      listId,
      position,
      closed,
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

export const getCardById = async (req: Request, res: Response) => {
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

export const deleteCard = async (req: Request, res: Response) => {
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

export const addCardMember = async (req: Request, res: Response) => {
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

  res.send({ status: "success", result });
};

export const deleteCardMember = async (req: Request, res: Response) => {
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

  res.send({ status: "success", result });
};

export const addCardLabel = async (req: Request, res: Response) => {
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

export const deleteCardLabel = async (req: Request, res: Response) => {
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

export const closeCard = async (req: Request, res: Response) => {
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
