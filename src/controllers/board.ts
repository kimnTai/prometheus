import BoardsModel from "@/models/board";
import LabelsModel from "@/models/label";
import jwt from "jsonwebtoken";

import type { Request, Response } from "express";
// import type { v4 as uuidv4 } from 'uuid';

// 取得當前使用者ID
const getUserIdFromToken = (req: Request) => {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split(" ")[1];
  const decodedToken = jwt.decode(token!) as { userId: string };
  const userId = decodedToken?.userId;

  return userId;
};

// F1. 取得全部看板 (GET)
export const getBoards = async (_req: Request, res: Response) => {
  const boards = await BoardsModel.find();
  res.status(200).json({ status: "success", result: boards });
};

// F2. 建立看板 (POST)
export const createBoard = async (req: Request, res: Response) => {
  const { title, orgID, permission } = req.body;
  const loginUserId = getUserIdFromToken(req);

  // 把當前使用者設為管理員
  const member = [{ userId: loginUserId, role: "manager" }];

  await BoardsModel.create({
    name: title,
    organizationId: orgID,
    permission,
    member,
  });

  res.send({ status: "success", message: "看板建立成功" });
};

// F3. 修改看板 (PUT)
export const updateBoard = async (req: Request, res: Response) => {
  const { title, newOrgID, permission, closed = false } = req.body;

  if (
    !(await BoardsModel.findByIdAndUpdate(req.params.boardID, {
      name: title,
      organizationId: newOrgID,
      permission,
      closed,
    }))
  ) {
    throw new Error("此看板不存在");
  }
  res.send({ status: "success", message: "看板修改成功" });
};

// F4. 刪除看板 (DELETE)
export const deleteBoard = async (req: Request, res: Response) => {
  const board = await BoardsModel.findById(req.params.boardID);
  const loginUserId = getUserIdFromToken(req);

  const isAdmin = board?.member.some(
    (member) =>
      member.userId.toString() === loginUserId && member.role === "manager"
  );

  if (isAdmin) {
    if (!(await BoardsModel.findByIdAndDelete(req.params.boardID))) {
      throw new Error("此看板不存在");
    }
  }

  res.send({ status: "success", message: "看板刪除成功" });
};

// F5. 邀請看板成員 (POST)
export const inviteToBoard = async (req: Request, res: Response) => {
  const { type } = req.body;

  switch (type) {
    case "email":
      res.send({ status: "success", message: "功能待做，預計會傳送Email" });
      break;
    case "link":
      const board = await BoardsModel.findById(req.params.boardID, {
        inviteLink: 1,
      });
      if (!board) {
        throw new Error("此看板不存在");
      }

      if (board.inviteLink) {
        board.inviteLink = "";
      } else {
        board.inviteLink = "testUUID";
        // board.inviteLink = uuidv4();
      }
      const newBoard = await BoardsModel.findByIdAndUpdate(req.params.boardID, {
        inviteLink: board.inviteLink,
      });
      res.send({ status: "success", result: newBoard });
      break;
    default:
      throw new Error("操作錯誤");
  }
};

// F6. 取得標籤 (GET)
export const getLabels = async (req: Request, res: Response) => {
  const labels = await LabelsModel.find({ boardId: req.params.boardID });
  res.status(200).json({ status: "success", result: labels });
};

// F7. 新增標籤 (POST)
export const createLabel = async (req: Request, res: Response) => {
  const { title, color } = req.body;

  if (
    await LabelsModel.findOne({
      name: title,
      boardId: req.params.boardID,
    })
  ) {
    throw new Error("標籤名稱重複");
  }

  await LabelsModel.create({
    name: title,
    color: color,
    boardId: req.params.boardID,
  });

  res.send({ status: "success", message: "標籤建立成功" });
};

// F8. 修改標籤 (PUT)
export const updateLabel = async (req: Request, res: Response) => {
  const { title, color } = req.body;

  if (
    !(await LabelsModel.findByIdAndUpdate(req.params.labelID, {
      name: title,
      color: color,
    }))
  ) {
    throw new Error("此標籤不存在");
  }
  res.send({ status: "success", message: "標籤修改成功" });
};

// F9. 刪除標籤 (DELETE)
export const deleteLabel = async (req: Request, res: Response) => {
  if (!(await LabelsModel.findByIdAndDelete(req.params.labelID))) {
    throw new Error("此標籤不存在");
  }

  res.send({ status: "success", message: "標籤刪除成功" });
};

// F10. 取得看板內所有成員 (GET)
export const getBoardUsers = async (req: Request, res: Response) => {
  const boardUsers = await BoardsModel.findById(req.params.boardID).populate(
    "member.userId"
  );

  res.status(200).json({ status: "success", result: boardUsers?.member });
};

// F11. 移除/退出看板 (POST)
export const quitBoard = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const board = await BoardsModel.findById(req.params.boardID);
  const loginUserId = getUserIdFromToken(req);

  const canPass = board?.member.some((member) => {
    return (
      (member.userId.toString() === loginUserId && member.role === "manager") ||
      (member.userId.toString() === loginUserId &&
        member.userId.toString() === userId)
    );
  });

  if (canPass) {
    await BoardsModel.findByIdAndUpdate(req.params.boardID, {
      member: board?.member.filter(
        (member) => member.userId.toString() !== userId
      ),
    });
  }

  res.send({ status: "success", message: "退出看板成功" });
};

// F12. 取得已封存列表/卡片 (GET)
export const getArchives = async (req: Request, res: Response) => {
  const archiveLists = await BoardsModel.findById(req.params.boardID).populate({
    path: "list",
    match: { boardId: req.params.boardID, closed: true },
    populate: [
      {
        path: "card",
      },
    ],
  });
  res.status(200).json({ status: "success", lists: archiveLists });
};
