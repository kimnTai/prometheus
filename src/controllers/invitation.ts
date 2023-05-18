import OrganizationModel from "@/models/organization";
import BoardsModel from "@/models/board";

import type { RequestHandler } from "express";
import { verifyToken } from "@/shared";

export const addBoardMember: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Other - 其它"]
   * #swagger.description  = "透過邀請連結新增 - 看板成員"
   */
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
  /**
   * #swagger.tags = ["Other - 其它"]
   * #swagger.description  = "透過邀請連結新增 - 組織成員"
   */
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
    }
  );

  res.send({ status: "success", result });
};
