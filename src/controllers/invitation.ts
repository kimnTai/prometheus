import type { RequestHandler } from "express";
import BoardsModel from "@/models/board";
import OrganizationModel from "@/models/organization";
import { verifyToken } from "@/shared";

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
  ).populate({
    path: "board",
  });

  res.send({ status: "success", result });
};
