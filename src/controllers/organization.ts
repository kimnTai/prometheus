import OrganizationModel from "@/models/organization";

import type { RequestHandler } from "express";

export const getUserOrganization: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Organization - 組織"]
   * #swagger.description  = "取得會員所有組織"
   */
  const result = await OrganizationModel.find({
    member: {
      $elemMatch: {
        userId: req.user?._id,
      },
    },
  });

  return res.send({ status: "success", result });
};

export const createOrganization: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Organization - 組織"]
   * #swagger.description  = "新增組織"
   */
  const { name, permission } = req.body;

  const result = await OrganizationModel.create({
    name,
    permission,
    // 把當前使用者設為管理員
    member: [
      {
        userId: req.user?._id,
        role: "manager",
      },
    ],
  });

  res.send({
    success: true,
    result,
  });
};

export const getOneOrganizationById: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Organization - 組織"]
   * #swagger.description  = "取得單一組織"
   */
  const result = await OrganizationModel.findById(req.params.organizationId);

  res.send({ status: "success", result });
};

export const updateOrganization: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Organization - 組織"]
   * #swagger.description  = "修改組織"
   */
  const { name, permission } = req.body;

  const result = await OrganizationModel.findByIdAndUpdate(
    req.params.organizationId,
    { name, permission },
    { new: true }
  );

  res.send({ status: "success", result });
};

export const deleteOrganization: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Organization - 組織"]
   * #swagger.description  = "刪除組織"
   */
  const result = await OrganizationModel.findOneAndDelete({
    $and: [
      { _id: req.params.organizationId },
      { "member.userId": req.user?._id },
      { "member.role": "manager" },
    ],
  });

  if (!result) {
    throw new Error("刪除組織錯誤");
  }

  res.send({ status: "success", message: "刪除組織成功" });
};

export const inviteOrganizationMember: RequestHandler = async (_req, res) => {
  /**
   * #swagger.tags = ["Organization - 組織"]
   * #swagger.description  = "邀請組織成員/產生邀請連結"
   */
  res.send({ status: "success", result: "https://www.google.com/" });
};

export const addOrganizationMember: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Organization - 組織"]
   * #swagger.description  = "新增組織成員"
   */
  const result = await OrganizationModel.findOneAndUpdate(
    {
      _id: req.params.organizationId,
    },
    {
      $addToSet: {
        member: {
          userId: req.body.userId,
        },
      },
    }
  );

  res.send({ status: "success", result });
};

export const deleteOrganizationMember: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Organization - 組織"]
   * #swagger.description  = "移除組織成員"
   */
  const result = await OrganizationModel.findOneAndUpdate(
    {
      _id: req.params.boardId,
    },
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

export const updateOrganizationMember: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Organization - 組織"]
   * #swagger.description  = "修改成員權限"
   */
  const organization = await OrganizationModel.findOne({
    $and: [
      { _id: req.params.organizationId },
      { "member.userId": req.user?._id },
      { "member.role": "manager" },
    ],
  });

  if (!organization) {
    throw new Error("修改錯誤");
  }

  const result = await OrganizationModel.findOneAndUpdate(
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
