import ListModel from "@/models/list";
import CardModel from "@/models/card";
import LabelsModel from "@/models/label";

import type { RequestHandler } from "express";
import { ILabel } from "@/models/label";

export const createList: RequestHandler = async (req, res) => {
  const { name, boardId, position } = req.body;

  const _result = await ListModel.create({
    name,
    boardId,
    position,
  });

  const result = {
    ..._result.toObject(),
    card: [],
  };

  res.app.emit(`boardId:${result.boardId}`, result);
  res.send({ status: "success", result });
};

export const updateList: RequestHandler = async (req, res) => {
  const { name, boardId, position, closed } = req.body;

  const result = await ListModel.findOneAndUpdate(
    { _id: req.params.listId },
    { name, boardId, position, closed },
    { new: true, runValidators: true }
  );

  if (!result) {
    throw new Error("無此列表 id");
  }

  res.app.emit(`boardId:${result.boardId}`, result);
  res.send({ status: "success", result });
};

export const deleteList: RequestHandler = async (req, res) => {
  const result = await ListModel.findByIdAndDelete(req.params.listId);

  const cardResult = await CardModel.updateMany(
    {
      listId: req.params.listId,
    },
    {
      closed: true,
    }
  );

  if (!result) {
    throw new Error("無此列表 id");
  }

  res.app.emit(`boardId:${result.boardId}`, result);
  res.send({ status: "success", result: { result, cardResult } });
};

export const archiveAllCards: RequestHandler = async (req, res) => {
  await CardModel.updateMany(
    {
      listId: req.params.listId,
    },
    {
      closed: true,
    },
    {
      new: true,
    }
  );

  const result = await ListModel.findById(req.params.listId);

  res.app.emit(`boardId:${result?.boardId}`, result);
  res.send({ status: "success", result });
};

export const moveList: RequestHandler = async (req, _res, next) => {
  const { boardId, sourceBoardId } = req.body;

  if (boardId && sourceBoardId && boardId !== sourceBoardId) {
    // 查詢列表卡片
    const result = await CardModel.find(
      {
        listId: req.params.listId,
      },
      {},
      { new: true, runValidators: true, shouldPopulate: false }
    ).populate("label");

    // 複製標籤
    const labelsList = result
      .flatMap(({ label }) => label)
      .reduce<ILabel[]>((pre, value) => {
        return pre.find(({ _id }) => _id === value._id) ? pre : [...pre, value];
      }, [])
      .map(({ _id, name, color }) => {
        return {
          originLabelId: _id,
          model: new LabelsModel({ name, color, boardId: boardId }),
        };
      });

    // 修改列表所有卡片
    const updateCardList = result.map((card) => {
      const newLabel = card.label.map(
        ({ _id }) =>
          labelsList.find(({ originLabelId }) => originLabelId === _id)?.model
            ._id
      );
      return CardModel.findByIdAndUpdate(
        card._id,
        {
          boardId: boardId,
          $set: {
            label: newLabel,
          },
        },
        { new: true, runValidators: true }
      );
    });

    await Promise.all([
      ...updateCardList,
      ...labelsList.map(({ model }) => model.save()),
    ]);
  }

  next();
};
