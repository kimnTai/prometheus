import type { RequestHandler } from "express";
import CardModel from "@/models/card";
import AttachmentModel from "@/models/card/attachment";
import CheckItemModel from "@/models/card/checkItem";
import ChecklistModel from "@/models/card/checklist";
import LabelsModel from "@/models/label";
import { generateNotification } from "@/service/notification";

export const createCard: RequestHandler = async (req, res) => {
  const { name, listId, position, boardId } = req.body;

  const _result = await CardModel.create({
    name,
    position,
    listId,
    boardId,
  });

  const result = {
    ..._result.toObject(),
    checklist: [],
    comment: [],
    attachment: [],
    date: null,
  };

  res.app.emit(`boardId:${result.boardId}`, result);
  res.send({ status: "success", result });
};

export const updateCard: RequestHandler = async (req, res) => {
  const { name, listId, position, closed, description, boardId } = req.body;

  const result = await CardModel.findByIdAndUpdate(
    req.params.cardId,
    {
      name,
      listId,
      position,
      closed,
      description,
      boardId,
    },
    { new: true, runValidators: true }
  );

  if (!result) {
    throw new Error("無此卡片 id");
  }

  res.app.emit(`boardId:${result.boardId}`, result);
  res.send({ status: "success", result });
};

export const getCardById: RequestHandler = async (req, res) => {
  const result = await CardModel.findById(req.params.cardId);

  if (!result) {
    throw new Error("無此卡片 id");
  }

  res.send({ status: "success", result });
};

export const deleteCard: RequestHandler = async (req, res) => {
  const result = await CardModel.findByIdAndDelete(req.params.cardId);

  // TODO:關聯卡片的修改

  if (!result) {
    throw new Error("無此卡片 id");
  }

  res.app.emit(`boardId:${result.boardId}`, result);
  res.send({ status: "success", result });
};

export const addCardMember: RequestHandler = async (req, res) => {
  const result = await CardModel.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: {
        member: {
          $each: req.body.userIdList.map((userId: string) => ({ userId })),
        },
      },
    },
    { new: true }
  );

  if (result) {
    // 產生通知
    req.body.userIdList
      .filter((userId: string) => userId !== req.user?.id)
      .forEach((userId: string) => {
        generateNotification({
          userId,
          type: "ADD_MEMBER",
          data: {
            card: {
              id: result.id,
              name: result.name,
            },
          },
          sourceUserId: req.user?.id,
        });
      });
  }

  res.app.emit(`boardId:${result?.boardId}`, result);
  res.send({ status: "success", result });
};

export const deleteCardMember: RequestHandler = async (req, res) => {
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

  if (result && req.params.memberId !== req.user?.id) {
    // 產生通知
    generateNotification({
      userId: req.params.memberId,
      type: "REMOVE_MEMBER",
      data: {
        card: {
          id: result.id,
          name: result.name,
        },
      },
      sourceUserId: req.user?.id,
    });
  }

  res.app.emit(`boardId:${result?.boardId}`, result);
  res.send({ status: "success", result });
};

export const addCardLabel: RequestHandler = async (req, res) => {
  const result = await CardModel.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: {
        label: req.body.labelId,
      },
    },
    { new: true }
  );

  res.app.emit(`boardId:${result?.boardId}`, result);
  res.send({ status: "success", result });
};

export const deleteCardLabel: RequestHandler = async (req, res) => {
  const result = await CardModel.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: {
        label: req.params.labelId,
      },
    },
    { new: true }
  );

  res.app.emit(`boardId:${result?.boardId}`, result);
  res.send({ status: "success", result });
};

export const closeCard: RequestHandler = async (req, res) => {
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

  res.app.emit(`boardId:${result.boardId}`, result);
  res.send({ status: "success", result });
};

export const cloneCardById: RequestHandler = async (req, res) => {
  const _result = await CardModel.findById(req.body.sourceCardId);

  if (!_result) {
    throw new Error("無此卡片 id");
  }

  // 複製標籤
  const cloneLabels = _result.label.map(({ name, color }) => {
    return new LabelsModel({ name, color, boardId: req.body.boardId });
  });

  // 標籤映射表
  const labelsMap = _result.label.reduce<{ [key in string]: string }>(
    (pre, { id }, i) => ({ ...pre, [id]: cloneLabels[i].id }),
    {}
  );

  // 從映射表映射標籤
  const _label = _result.label.map((item) => labelsMap[item._id]);

  // 複製卡片
  const cloneCard = new CardModel({
    name: req.body.name,
    boardId: req.body.boardId,
    listId: req.body.listId,
    position: req.body.position,
    description: _result.description,
    label: _label,
  });

  // 複製附件
  const attachment = _result.attachment.flatMap(({ dirname, filename }) => {
    return new AttachmentModel({
      dirname,
      filename,
      cardId: cloneCard.id,
      userId: req.user?._id,
    });
  });

  // 複製待辦清單
  const checklist = _result.checklist.flatMap(
    ({ name, position, checkItem }) => {
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
    }
  );

  await Promise.all(
    [...cloneLabels, cloneCard, ...attachment, ...checklist].map((model) =>
      model.save()
    )
  );

  const result = await CardModel.findById(cloneCard._id);

  res.app.emit(`boardId:${result?.boardId}`, result);
  res.send({ status: "success", result });
};

export const moveCard: RequestHandler = async (req, res, next) => {
  const { listId, position, closed, boardId, sourceBoardId } = req.body;

  if (boardId && sourceBoardId && boardId !== sourceBoardId) {
    const _result = await CardModel.findByIdAndUpdate(
      req.params.cardId,
      {
        listId,
        position,
        closed,
        boardId,
      },
      { new: true, runValidators: true, shouldPopulate: false }
    ).populate("label");

    if (!_result) {
      throw new Error("無此卡片 id");
    }

    // 複製標籤
    const cloneLabels = _result.label.map(({ name, color }) => {
      return new LabelsModel({ name, color, boardId: req.body.boardId });
    });
    cloneLabels.forEach((model) => model.save());

    const result = await CardModel.findByIdAndUpdate(
      req.params.cardId,
      {
        $set: {
          label: cloneLabels.map(({ _id }) => _id),
        },
      },
      { new: true, runValidators: true }
    );

    res.app.emit(`boardId:${result?.boardId}`, result);
    res.send({ status: "success", result: result });

    return;
  }

  updateCard(req, res, next);
};
