import validator from "validator";
import BoardsModel from "@/models/board";
import CardModel from "@/models/card";
import OrganizationModel from "@/models/organization";
import UsersModel from "@/models/user";

import type { RequestHandler } from "express";

export const searchMember: RequestHandler = async (req, res) => {
  const { query, organizationId } = req.query;

  if (!query) {
    throw new Error("query 錯誤!");
  }

  const excludedIds = (
    await OrganizationModel.findById(organizationId)
  )?.member.map(({ userId }) => userId._id);

  const key = validator.isEmail(`${query}`) ? "email" : "name";

  const result = await UsersModel.find({
    [key]: new RegExp(`${query}`),
    _id: {
      $nin: excludedIds,
    },
  });

  return res.send({ status: "success", result });
};

export const searchCards: RequestHandler = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    throw new Error("query 錯誤!");
  }

  const userOrganization = await OrganizationModel.find({
    member: {
      $elemMatch: {
        userId: req.user?._id,
      },
    },
  }).populate({
    path: "board",
  });

  const cardList = await CardModel.find(
    {
      name: new RegExp(`${query}`),
      boardId: {
        $in: userOrganization
          .flatMap(({ board }) => board)
          .map(({ _id }) => _id),
      },
      closed: false,
    },
    {},
    {
      shouldPopulate: false,
    }
  );

  const result = await Promise.all(
    cardList.map(async (card) => {
      const board = await BoardsModel.findById(card.boardId);
      return {
        board,
        card,
      };
    })
  );

  return res.send({ status: "success", result });
};
