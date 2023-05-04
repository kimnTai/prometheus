import type { Request, Response } from "express";
import OrganizationModel from "@/models/organization";

// 取得會員所有組織
export const getMemberOrganization = async (req: Request, res: Response) => {
  const result = await OrganizationModel.find({
    member: {
      $elemMatch: {
        userId: req.user?._id,
      },
    },
  });

  return res.send({ status: "success", result });
};

// 新增組織
export const createOrganization = async (req: Request, res: Response) => {
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

// 取得單一組織
export const getOneOrganizationById = async (req: Request, res: Response) => {
  const result = await OrganizationModel.findById(req.params.organizationId);

  res.send({ status: "success", result });
};

// 修改組織
export const updateOrganization = async (req: Request, res: Response) => {
  const { name, permission } = req.body;

  const result = await OrganizationModel.findByIdAndUpdate(
    req.params.organizationId,
    { name, permission },
    { new: true }
  );

  res.send({ status: "success", result });
};

// 刪除組織
export const deleteOrganization = async (req: Request, res: Response) => {
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

// 邀請組織成員/產生邀請連結
export const inviteOrganizationMember = async (
  _req: Request,
  res: Response
) => {
  res.send({ status: "success", result: "https://www.google.com/" });
};

// 退出組織成員
export const deleteOrganizationMember = async (req: Request, res: Response) => {
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

// 修改成員權限
export const updateMemberRole = async (req: Request, res: Response) => {
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
    throw new Error("Member not found");
  }

  return res.send({ message: "Member role updated successfully" });
};
