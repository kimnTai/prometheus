import { Router } from "express";
import validator from "validator";
import jsonWebToken, { type JwtPayload } from "jsonwebtoken";

import type { Request, RequestHandler } from "express";

function catchAsync(func: RequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next);
  };
}

function catchAsyncRouter(router: Router) {
  for (const key in router) {
    if (
      key === "get" ||
      key === "post" ||
      key === "delete" ||
      key === "patch" ||
      key === "put" ||
      key === "use"
    ) {
      const method = router[key];

      router[key] = (...args: any[]) => {
        const newArgs = args.map((value) => {
          return typeof value === "function" ? catchAsync(value) : value;
        });

        return method.call<any, any, any>(router, ...newArgs);
      };
    }
  }

  return router;
}

export function createRouter() {
  return catchAsyncRouter(Router());
}

export function checkValidator(param: {
  [key: string]: string | number | undefined;
}) {
  for (let [key, value] of Object.entries(param)) {
    if (value === undefined || value === null) {
      throw new Error("欄位未填寫正確");
    }

    if (typeof value === "number") {
      value = `${value}`;
    }

    switch (key) {
      case "name":
        if (!validator.isLength(value, { min: 2 })) {
          throw new Error("name 至少 2 個字元以上");
        }
        break;
      case "email":
        if (!validator.isEmail(value)) {
          throw new Error("Email 格式不正確");
        }
        break;
      case "password":
        if (!validator.isLength(value, { min: 8 })) {
          throw new Error("密碼需至少 8 碼以上");
        }
        if (validator.isAlpha(value)) {
          throw new Error("密碼不能只有英文");
        }
        if (validator.isNumeric(value)) {
          throw new Error("密碼不能只有數字");
        }
        if (!validator.isAlphanumeric(value)) {
          throw new Error("密碼需至少 8 碼以上，並英數混合");
        }
        break;
      case "image":
        if (!validator.isURL(value, { protocols: ["https"] })) {
          throw new Error("image 格式不正確");
        }
        break;
      case "avatar":
        if (!validator.isURL(value, { protocols: ["https"] })) {
          throw new Error("avatar 格式不正確");
        }
        break;
      case "color":
        if (!validator.isHexColor(value)) {
          throw new Error("color 必須為十六進制顏色");
        }
        break;
      case "position":
        if (!validator.isNumeric(value)) {
          throw new Error("position 必須為數字");
        }
        if (Number(value) <= 0) {
          throw new Error("position 必須大於 0");
        }
        break;
      default:
        break;
    }
  }
}

export function generateToken(payload: {
  userId?: string;
  email?: string;
  organizationId?: string;
  boardId?: string;
}) {
  return jsonWebToken.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
}

export function verifyToken(token: string) {
  try {
    return jsonWebToken.verify(token, process.env.JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error("驗證失敗!");
  }
}

export function getWebsocketUrl(req: Request) {
  const host = req.headers.host;
  return `${host?.includes("localhost") ? "ws" : "wss"}:${host}/socket`;
}
