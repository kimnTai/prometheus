import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import OrganizationModel from "@/models/organization";

// 取得當前使用者ID
const getUserIdFromToken = (req: Request) => {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split(" ")[1];
  const decodedToken = jwt.decode(token!) as { userId: string };
  const userId = decodedToken?.userId;
  return userId;
};

// 新增組織
export const addOrganization = async (req: Request, res: Response) => {
  const { name, permission, board = [] } = req.body;

  const userId = getUserIdFromToken(req);

  // 把當前使用者設為管理員
  const member = [{ userId: userId, role: "manager" }];

  const organization = new OrganizationModel({
    name,
    permission,
    userId,
    member,
    board,
  });

  await organization.save();

  res.status(200).send({
    success: true,
    message: "Organization created successfully",
    organizations: organization,
  });
};

// 取得單一組織
export const getOneOrganization = async (req: Request, res: Response) => {
  const orgID = req.params.orgID;

  const organization = await OrganizationModel.findById(orgID);

  res.status(200).json({ status: "success", result: organization });
};

//修改組織
export const updateOrganization = async (req: Request, res: Response) => {
  const orgID = req.params.orgID;
  const { name, permission } = req.body;

  const organization = await OrganizationModel.findByIdAndUpdate(
    orgID,
    { name, permission },
    { new: true }
  );

  res.status(200).json({ status: "success", result: organization });
};

//刪除組織
export const deleteOrganization = async (req: Request, res: Response) => {
  const orgID = req.params.orgID;

  const deletedOrganization = await OrganizationModel.findByIdAndDelete(orgID);

  if (!deletedOrganization) {
    res.status(404).json({ status: "fail", message: "Organization not found" });
  }

  res
    .status(200)
    .json({ status: "success", message: "Organization deleted successfully" });
};

//邀請組織成員/產生邀請連結 TODO
export const inviteOrganizationMember = async (
  _req: Request,
  _res: Response
) => {};

//取得所有成員
export const getAllMembers = async (req: Request, res: Response) => {
  const orgID = req.params.orgID;

  const organization = await OrganizationModel.findById(orgID).populate(
    "member.userId"
  );

  const members = organization?.member.map((member) => {
    return {
      userId: member.userId._id,
      name: member.userId.name,
      role: member.role,
    };
  });

  res.status(200).json({ status: "success", result: members });
};

//退出組織
export const quitOrganization = async (req: Request, res: Response) => {
  const orgID = req.params.orgID;
  const userId = getUserIdFromToken(req);

  const organization = await OrganizationModel.findById(orgID);

  const isAdmin = organization?.member.filter(
    (member) => member.userId.toString() === userId && member.role === "manager"
  );

  if (isAdmin) {
    // 更新看板的擁有者
    // const updatedBoard = organization?.board.map((board) => {
    //   if (board.owner.toString() === userId) {
    //     board.owner = organization.member[0].userId;
    //   }
    //   return board;
    // });

    await OrganizationModel.findByIdAndUpdate(orgID, {
      member: organization?.member.filter(
        (member) => member.userId.toString() !== userId
      ),
      // board: updatedBoard,
    });
  } else {
    const updatedMembers = organization?.member.filter(
      (member) => member.userId.toString() !== userId
    );

    await OrganizationModel.findByIdAndUpdate(orgID, {
      member: updatedMembers,
    });
  }

  return res
    .status(200)
    .send({ status: "success", message: "User has left the organization" });
};

//修改成員權限
export const updateMemberRole = async (req: Request, res: Response) => {
  const orgID = req.params.orgID;

  const { memberId, role } = req.body;

  const organization = await OrganizationModel.findById(orgID);

  const isAdmin = organization?.member.some(
    (member) =>
      member.userId.toString() === getUserIdFromToken(req) &&
      member.role === "manager"
  );

  if (!isAdmin) {
    return res
      .status(403)
      .send({ message: "You do not have permission to perform this action" });
  }

  const member = organization?.member.find(
    (member) => member.userId.toString() === memberId
  );
  if (!member) {
    return res.status(404).send({ message: "Member not found" });
  }

  member.role = role;
  await organization?.save();

  return res.status(200).send({ message: "Member role updated successfully" });
};
