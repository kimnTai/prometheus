import OrganizationModel from "@/models/organization";
import BoardsModel from "@/models/board";
import { verifyToken } from "@/shared";

import type { RequestHandler } from "express";

export const addBoardMember: RequestHandler = async (req, res) => {
  const { boardId } = verifyToken(req.params.invitationToken);

  const result = await BoardsModel.findOneAndUpdate(
    {
      _id: boardId,
    },
    {
      $addToSet: {
        member: {
          userId: req.user?._id,
        },
      },
    },
    { new: true }
  );

  res.send({ status: "success", result });
};

export const addOrganizationMember: RequestHandler = async (req, res) => {
  const { organizationId } = verifyToken(req.params.invitationToken);

  const result = await OrganizationModel.findOneAndUpdate(
    {
      _id: organizationId,
    },
    {
      $addToSet: {
        member: {
          userId: req.user?._id,
        },
      },
    },
    {
      new: true,
    }
  );

  res.send({ status: "success", result });
};
