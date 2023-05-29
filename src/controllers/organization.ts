import OrganizationModel from "@/models/organization";
import { generateNotification } from "@/service/notification";
import { generateToken } from "@/shared";

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
  }).populate({
    path: "board",
  });

  res.send({ status: "success", result });
};

export const createOrganization: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Organization - 組織"]
   * #swagger.description  = "新增組織"
   */
  const { name, permission, userIdList } = req.body;

  const _result = await OrganizationModel.create({
    name,
    permission,
    member: [
      // 把當前使用者設為管理員
      {
        userId: req.user?._id,
        role: "manager",
      },
      // 邀請加入的成員
      ...userIdList.map((userId: string) => ({ userId })),
    ],
  });

  // 需要成員資料，所以 result 用查的
  const result = await OrganizationModel.findById(_result.id).populate({
    path: "board",
  });

  if (result) {
    // 產生通知
    userIdList
      .filter((userId: string) => userId !== req.user?.id)
      .forEach((userId: string) => {
        generateNotification({
          userId,
          type: "ADD_MEMBER",
          data: {
            organization: {
              id: result.id,
              name: result.name,
            },
          },
          sourceUserId: req.user?.id,
        });
      });
  }

  res.send({ success: true, result });
};

export const getOneOrganizationById: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Organization - 組織"]
   * #swagger.description  = "取得單一組織"
   */
  const result = await OrganizationModel.findById(
    req.params.organizationId
  ).populate({
    path: "board",
  });

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
  ).populate({
    path: "board",
  });

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

export const createInviteOrganizationUrl: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Organization - 組織"]
   * #swagger.description  = "建立組織邀請連結"
   */
  const token = generateToken({ organizationId: req.params.organizationId });
  const result = await OrganizationModel.findByIdAndUpdate(
    req.params.organizationId,
    {
      inviteLink: `${process.env.CLIENT_URL}/invitation/organizations/${token}`,
    },
    { new: true }
  ).populate({
    path: "board",
  });

  res.send({ status: "success", result });
};

export const addOrganizationMember: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Organization - 組織"]
   * #swagger.description  = "新增多位組織成員"
   */
  const result = await OrganizationModel.findOneAndUpdate(
    {
      _id: req.params.organizationId,
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
    path: "board",
  });

  if (result) {
    // 產生通知
    req.body.userIdList.forEach((userId: string) => {
      generateNotification({
        userId,
        type: "ADD_MEMBER",
        data: {
          organization: {
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

export const deleteOrganizationMember: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Organization - 組織"]
   * #swagger.description  = "移除組織成員"
   */
  const result = await OrganizationModel.findOneAndUpdate(
    {
      _id: req.params.organizationId,
    },
    {
      $pull: {
        member: {
          userId: req.params.memberId,
        },
      },
    },
    { new: true }
  ).populate({
    path: "board",
  });

  if (result) {
    // 產生通知
    generateNotification({
      userId: req.params.memberId,
      type: "REMOVE_MEMBER",
      data: {
        organization: {
          id: result.id,
          name: result.name,
        },
      },
      sourceUserId: req.user?.id,
    });
  }

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
      _id: req.params.organizationId,
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
    path: "board",
  });

  if (!result) {
    throw new Error("無此成員!");
  }

  // 產生通知
  generateNotification({
    userId: req.params.memberId,
    type: "UPDATE_ROLE",
    data: {
      organization: {
        id: result.id,
        name: result.name,
        role: req.body.role,
      },
    },
    sourceUserId: req.user?.id,
  });

  res.send({ status: "success", result });
};
