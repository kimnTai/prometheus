import BoardsModel from "@/models/board";
import LabelsModel from "@/models/label";
import ListModel from "@/models/list";
import CardModel from "@/models/card";

import type { RequestHandler } from "express";
import { generateToken } from "@/shared";

export const getAllBoards: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "取得所有看板"
   */
  const { organizationId } = req.query;
  const result = await BoardsModel.find({ organizationId });
  res.send({ status: "success", result });
};

export const createBoard: RequestHandler = async (req, res) => {
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

export const getBoardById: RequestHandler = async (req, res) => {
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

export const updateBoard: RequestHandler = async (req, res) => {
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

export const deleteBoard: RequestHandler = async (req, res) => {
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

export const getInvitationUrl: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "取得看板邀請連結"
   */
  const result = await BoardsModel.findById(req.params.boardId);
  res.send({ status: "success", result: result?.inviteLink });
};

export const createInvitationUrl: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "建立看板邀請連結"
   */
  const token = generateToken({ boardId: req.params.boardId });
  const result = await BoardsModel.findByIdAndUpdate(
    req.params.boardId,
    {
      inviteLink: `https://feijai.github.io/Lunar/#/invitation/boards/${token}`,
    },
    { new: true }
  );
  res.send({ status: "success", result: result });
};

export const deleteInvitationUrl: RequestHandler = async (req, res) => {
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

export const getBoardLabels: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "取得標籤"
   */
  const result = await LabelsModel.find({ boardId: req.params.boardId });
  res.send({ status: "success", result });
};

export const createLabel: RequestHandler = async (req, res) => {
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

export const updateLabel: RequestHandler = async (req, res) => {
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

export const deleteLabel: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "刪除標籤"
   */
  const result = await LabelsModel.findByIdAndDelete(req.params.labelId);
  if (!result) {
    throw new Error("此標籤不存在");
  }

  res.send({ status: "success", result });
};

export const getBoardMembers: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "取得看板內所有成員"
   */
  const boardUsers = await BoardsModel.findById(req.params.boardId);
  res.send({ status: "success", result: boardUsers?.member });
};

export const addBoardMember: RequestHandler = async (req, res) => {
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
          userId: req.body.userId,
        },
      },
    },
    { new: true }
  );

  res.send({ status: "success", result });
};

export const updateBoardMember: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "修改看板成員權限"
   */
  const board = await BoardsModel.findOne({
    $and: [
      { _id: req.params.boardId },
      { "member.userId": req.user?._id },
      { "member.role": "manager" },
    ],
  });

  if (!board) {
    throw new Error("修改錯誤");
  }

  const result = await BoardsModel.findOneAndUpdate(
    {
      "member.userId": req.params.memberId,
    },
    {
      $set: {
        "member.$.role": req.body.role,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!result) {
    throw new Error("無此成員!");
  }

  res.send({ status: "success", result });
};

export const deleteBoardMember: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "移除/退出看板"
   */
  const result = await BoardsModel.findByIdAndUpdate(
    req.params.boardId,
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

export const getClosedCardsAndList: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "取得已封存列表/卡片"
   *
   * TODO:查了三次組資料，待優化
   */
  const [closedList, closedCard] = await Promise.all([
    ListModel.find({
      boardId: req.params.boardId,
      closed: true,
    }),
    CardModel.find({
      listId: {
        $in: await ListModel.find({
          boardId: req.params.boardId,
        }),
      },
      closed: true,
    }),
  ]);

  res.send({ status: "success", result: { closedList, closedCard } });
};
