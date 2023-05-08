import validator from "validator";
import UsersModel from "@/models/user";
import OrganizationModel from "@/models/organization";

import type { Request, Response } from "express";

export const searchMember = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ["Other - 其它"]
   */
  const { query, organizationId } = req.query;

  if (!query) {
    throw new Error("query 錯誤!");
  }

  const excludedIds = (
    await OrganizationModel.findById(organizationId)
  )?.member.map(({ _id }) => _id);

  const key = validator.isEmail(`${query}`) ? "email" : "name";

  const result = await UsersModel.find({
    [key]: new RegExp(`${query}`),
    _id: {
      $nin: excludedIds,
    },
  });

  return res.send({ status: "success", result });
};
