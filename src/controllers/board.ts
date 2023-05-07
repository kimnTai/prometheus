import BoardsModel from "@/models/board";
import LabelsModel from "@/models/label";

import type { Request, Response } from "express";

export const getAllBoards = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "取得所有看板"
   */
  const { organizationId } = req.query;
  const result = await BoardsModel.find({ organizationId });
  res.send({ status: "success", result });
};

export const createBoard = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "建立看板"
   */
  const { name, organizationId, permission } = req.body;

  const result = await BoardsModel.create({
    name,
    organizationId,
    permission,
    // 把當前使用者設為管理員
    member: [{ userId: req.user?._id, role: "manager" }],
  });

  res.send({ status: "success", result });
};

export const getBoardById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "取得單一看板"
   */
  const result = await BoardsModel.findById(req.params.boardId);

  if (!result) {
    throw new Error("無此看板 id");
  }

  res.send({ status: "success", result });
};

export const updateBoard = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "修改看板"
   */
  const { name, organizationId, permission, closed } = req.body;

  const result = await BoardsModel.findByIdAndUpdate(req.params.boardId, {
    name,
    organizationId,
    permission,
    closed,
  });

  if (!result) {
    throw new Error("修改看板錯誤");
  }

  res.send({ status: "success", result });
};

export const deleteBoard = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "刪除看板"
   */
  const result = await BoardsModel.findOneAndDelete({
    $and: [
      { _id: req.params.boardId },
      { "member.userId": req.user?._id },
      { "member.role": "manager" },
    ],
  });

  if (!result) {
    throw new Error("刪除看板錯誤");
  }

  res.send({ status: "success", result });
};

export const getInvitationUrl = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "取得看板邀請連結"
   */
  const result = await BoardsModel.findById(req.params.boardId);
  res.send({ status: "success", result: result?.inviteLink });
};

export const createInvitationUrl = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "建立看板邀請連結"
   */
  const result = await BoardsModel.findByIdAndUpdate(
    req.params.boardId,
    {
      inviteLink: "https://www.google.com/",
    },
    { new: true }
  );
  res.send({ status: "success", result: result?.inviteLink });
};

export const deleteInvitationUrl = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "移除看板邀請連結"
   */
  const result = await BoardsModel.findByIdAndUpdate(
    req.params.boardId,
    {
      inviteLink: "",
    },
    { new: true }
  );
  res.send({ status: "success", result });
};

export const getBoardLabels = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "取得標籤"
   */
  const result = await LabelsModel.find({ boardId: req.params.boardId });
  res.send({ status: "success", result });
};

export const createLabel = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "新增標籤"
   */
  const result = await LabelsModel.create({
    name: req.body.name,
    color: req.body.color,
    boardId: req.params.boardId,
  });

  res.send({ status: "success", result });
};

export const updateLabel = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "修改標籤"
   */
  const result = await LabelsModel.findByIdAndUpdate(
    req.params.labelId,
    {
      name: req.body.name,
      color: req.body.color,
    },
    { new: true }
  );

  if (!result) {
    throw new Error("此標籤不存在");
  }

  res.send({ status: "success", result });
};

export const deleteLabel = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "刪除標籤"
   */
  const result = await LabelsModel.findByIdAndDelete(req.params.labelId);
  if (!result) {
    throw new Error("此標籤不存在");
  }

  res.send({ status: "success", message: "標籤移除成功" });
};

export const getBoardMembers = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "取得看板內所有成員"
   */
  const boardUsers = await BoardsModel.findById(req.params.boardId);
  res.send({ status: "success", result: boardUsers?.member });
};

export const addBoardMember = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "新增看板成員"
   */
  const result = await BoardsModel.findOneAndUpdate(
    {
      _id: req.params.boardId,
    },
    {
      $addToSet: {
        member: {
          userId: req.user?._id,
        },
      },
    }
  );

  res.send({ status: "success", message: result });
};

export const quitBoard = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "移除/退出看板"
   */
  const result = await BoardsModel.findOneAndUpdate(
    {
      _id: req.params.boardId,
    },
    {
      $pull: {
        member: {
          userId: req.user?._id,
        },
      },
    }
  );

  res.send({ status: "success", message: result });
};

export const getArchives = async (_req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "取得已封存列表/卡片"
   */
  res.send({ status: "success", result: "TODO" });
};
