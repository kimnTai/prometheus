import { generateToken } from "@/shared";
import OrganizationModel from "@/models/organization";
import BoardsModel from "@/models/board";
import LabelsModel from "@/models/label";
import ListModel from "@/models/list";
import CardModel from "@/models/card";
import ChecklistModel from "@/models/card/checklist";
import CheckItemModel from "@/models/card/checkItem";
import AttachmentModel from "@/models/card/attachment";
import { generateNotification } from "@/service/notification";

import type { RequestHandler } from "express";

export const getAllBoards: RequestHandler = async (req, res) => {
  const result = await BoardsModel.find({
    organizationId: req.query.organizationId,
  }).populate({
    path: "list",
    select: "-createdAt -updatedAt",
    match: {
      closed: false,
    },
  });
  res.send({ status: "success", result });
};

export const createBoard: RequestHandler = async (req, res) => {
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
  const result = await BoardsModel.findById(req.params.boardId).populate({
    path: "list",
    select: "-createdAt -updatedAt",
    match: {
      closed: false,
    },
  });

  if (!result) {
    throw new Error("無此看板 id");
  }

  res.send({ status: "success", result });
};

export const updateBoard: RequestHandler = async (req, res) => {
  const { name, organizationId, permission, closed, image } = req.body;

  const result = await BoardsModel.findByIdAndUpdate(
    req.params.boardId,
    {
      name,
      organizationId,
      permission,
      closed,
      image,
    },
    { new: true }
  ).populate({
    path: "list",
    select: "-createdAt -updatedAt",
    match: {
      closed: false,
    },
  });

  if (!result) {
    throw new Error("修改看板錯誤");
  }

  res.send({ status: "success", result });
};

export const deleteBoard: RequestHandler = async (req, res) => {
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
  const result = await BoardsModel.findById(req.params.boardId);
  res.send({ status: "success", result: result?.inviteLink });
};

export const createInvitationUrl: RequestHandler = async (req, res) => {
  const token = generateToken({ boardId: req.params.boardId });
  const result = await BoardsModel.findByIdAndUpdate(
    req.params.boardId,
    {
      inviteLink: `${process.env.CLIENT_URL}/invitation/boards/${token}`,
    },
    { new: true }
  ).populate({
    path: "list",
    select: "-createdAt -updatedAt",
    match: {
      closed: false,
    },
  });
  res.send({ status: "success", result: result });
};

export const deleteInvitationUrl: RequestHandler = async (req, res) => {
  const result = await BoardsModel.findByIdAndUpdate(
    req.params.boardId,
    {
      inviteLink: "",
    },
    { new: true }
  ).populate({
    path: "list",
    select: "-createdAt -updatedAt",
    match: {
      closed: false,
    },
  });
  res.send({ status: "success", result });
};

export const getBoardLabels: RequestHandler = async (req, res) => {
  const result = await LabelsModel.find({ boardId: req.params.boardId });
  res.send({ status: "success", result });
};

export const createLabel: RequestHandler = async (req, res) => {
  const result = await LabelsModel.create({
    name: req.body.name,
    color: req.body.color,
    boardId: req.params.boardId,
  });

  res.send({ status: "success", result });
};

export const updateLabel: RequestHandler = async (req, res) => {
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
  const boardUsers = await BoardsModel.findById(req.params.boardId).populate({
    path: "list",
    select: "-createdAt -updatedAt",
    match: {
      closed: false,
    },
  });
  res.send({ status: "success", result: boardUsers?.member });
};

export const addBoardMember: RequestHandler = async (req, res) => {
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
  ).populate({
    path: "list",
    select: "-createdAt -updatedAt",
    match: {
      closed: false,
    },
  });

  if (result) {
    // 產生通知
    req.body.userIdList
      .filter((userId: string) => userId !== req.user?.id)
      .forEach((userId: string) => {
        generateNotification({
          userId,
          type: "ADD_MEMBER",
          data: {
            board: {
              id: result.id,
              name: result.name,
            },
          },
          sourceUserId: req.user?.id,
        });
      });
  }

  res.send({ status: "success", result });
};

export const updateBoardMember: RequestHandler = async (req, res) => {
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
  ).populate({
    path: "list",
    select: "-createdAt -updatedAt",
    match: {
      closed: false,
    },
  });

  if (!result) {
    throw new Error("無此成員!");
  }

  // 產生通知
  generateNotification({
    userId: req.params.memberId,
    type: "UPDATE_ROLE",
    data: {
      board: {
        id: result.id,
        name: result.name,
        role: req.body.role,
      },
    },
    sourceUserId: req.user?.id,
  });

  res.send({ status: "success", result });
};

export const deleteBoardMember: RequestHandler = async (req, res) => {
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
  ).populate({
    path: "list",
    select: "-createdAt -updatedAt",
    match: {
      closed: false,
    },
  });

  if (result && req.params.memberId !== req.user?.id) {
    // 產生通知
    generateNotification({
      userId: req.params.memberId,
      type: "REMOVE_MEMBER",
      data: {
        board: {
          id: result.id,
          name: result.name,
        },
      },
      sourceUserId: req.user?.id,
    });
  }

  res.send({ status: "success", result });
};

export const getClosedCardsAndList: RequestHandler = async (req, res) => {
  const [closedList, closedCard] = await Promise.all([
    ListModel.find({
      boardId: req.params.boardId,
      closed: true,
    }),
    CardModel.find({
      boardId: req.params.boardId,
      closed: true,
    }),
  ]);

  res.send({ status: "success", result: { closedList, closedCard } });
};

export const cloneBoardById: RequestHandler = async (req, res) => {
  const [originBoard, organization] = await Promise.all([
    BoardsModel.findById(req.body.sourceBoardId).populate({
      path: "list",
      select: "-createdAt -updatedAt",
      match: {
        closed: false,
      },
    }),
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
