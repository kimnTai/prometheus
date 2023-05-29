import { generateToken } from "@/shared";
import OrganizationModel from "@/models/organization";
import BoardsModel from "@/models/board";
import LabelsModel from "@/models/label";
import ListModel from "@/models/list";
import CardModel from "@/models/card";
import ChecklistModel from "@/models/card/checklist";
import CheckItemModel from "@/models/card/checkItem";
import AttachmentModel from "@/models/card/attachment";

import type { RequestHandler } from "express";

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
  const { name, organizationId, permission, image } = req.body;

  const _result = await BoardsModel.create({
    name,
    organizationId,
    permission,
    image,
    // 把當前使用者設為管理員
    member: [
      {
        userId: req.user?._id,
        role: "manager",
      },
    ],
  });

  const result = {
    ..._result.toObject(),
    list: [],
    label: [],
    member: [
      {
        userId: {
          _id: req.user?._id,
          name: req.user?.name,
          email: req.user?.email,
          avatar: req.user?.avatar,
        },
        role: "manager",
      },
    ],
  };

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
  const { name, organizationId, permission, closed, image } = req.body;

  const result = await BoardsModel.findByIdAndUpdate(req.params.boardId, {
    name,
    organizationId,
    permission,
    closed,
    image,
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
      inviteLink: `${process.env.CLIENT_URL}/invitation/boards/${token}`,
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
   * #swagger.description  = "新增多位看板成員"
   */
  const result = await BoardsModel.findOneAndUpdate(
    {
      _id: req.params.boardId,
    },
    {
      $addToSet: {
        member: {
          $each: req.body.userIdList.map((userId: string) => ({ userId })),
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
      _id: req.params.boardId,
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

export const cloneBoardById: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Boards - 看板"]
   * #swagger.description  = "複製單一看板"
   */

  const [originBoard, organization] = await Promise.all([
    BoardsModel.findById(req.body.sourceBoardId),
    OrganizationModel.findById(req.body.organizationId),
  ]);

  if (!originBoard) {
    throw new Error("無此看板 id");
  }

  if (!organization) {
    throw new Error("無此組織 id");
  }

  // 複製看板
  const cloneBoard = new BoardsModel({
    name: req.body.name,
    organizationId: req.body.organizationId,
    member: [{ userId: req.user?._id, role: "manager" }],
  });

  // 複製標籤
  const cloneLabels = originBoard.label.map(({ name, color }) => {
    return new LabelsModel({ name, color, boardId: cloneBoard.id });
  });

  // 標籤映射表
  const labelsMap = originBoard.label.reduce<{ [key in string]: string }>(
    (pre, { id }, i) => ({ ...pre, [id]: cloneLabels[i].id }),
    {}
  );

  // 複製卡片相關 model
  const cloneTotal = originBoard.list.flatMap(({ name, position, card }) => {
    // 複製列表
    const cloneLists = new ListModel({
      boardId: cloneBoard.id,
      name,
      position,
    });

    return [
      cloneLists,
      ...card.flatMap(
        ({ name, position, description, checklist, label, attachment }) => {
          // 從映射表映射標籤
          const _label = label.map((item) => labelsMap[item._id]);
          // 複製卡片
          const cloneCard = new CardModel({
            listId: cloneLists.id,
            boardId: cloneBoard.id,
            name,
            position,
            description,
            label: _label,
          });

          return [
            cloneCard,
            ...attachment.flatMap(({ dirname, filename }) => {
              // 複製附件
              return new AttachmentModel({
                dirname,
                filename,
                cardId: cloneCard.id,
                userId: req.user?._id,
              });
            }),
            ...checklist.flatMap(({ name, position, checkItem }) => {
              // 複製待辦清單
              const cloneChecklist = new ChecklistModel({
                name,
                position,
                cardId: cloneCard.id,
              });

              return [
                cloneChecklist,
                ...checkItem.flatMap(({ name, position }) => {
                  // 複製代辦事項
                  return new CheckItemModel({
                    name,
                    position,
                    checklistId: cloneChecklist.id,
                  });
                }),
              ];
            }),
          ];
        }
      ),
    ];
  });

  // 等待所有 model 存入資料庫
  await Promise.all(
    [cloneBoard, ...cloneLabels, ...cloneTotal].map((model) => model.save())
  );

  // 最終結果用查的，方便前端接
  const result = await BoardsModel.findById(cloneBoard._id);

  res.send({ status: "success", result });
};
