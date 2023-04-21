import { Router } from "express";
import validator from "validator";

import type { Request, Response, NextFunction, RequestHandler } from "express";

function catchAsync(func: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next);
  };
}

function catchAsyncRouter(router: Router) {
  for (const key in router) {
    if (
      key === "get" ||
      key === "post" ||
      key === "delete" ||
      key === "patch"
    ) {
      const method = router[key];

      router[key] = (path: any, ...callbacks: any) => {
        return method.call<any, any, any>(
          router,
          path,
          ...callbacks.map((cb: any) => catchAsync(cb))
        );
      };
    }
  }

  return router;
}

export function createRouter() {
  return catchAsyncRouter(Router());
}

export const checkValidator = (param: {
  [key: string]: string | undefined;
}) => {
  for (const [key, value] of Object.entries(param)) {
    if (!value) {
      throw new Error("欄位未填寫正確");
    }
    switch (key) {
      case "name":
        if (!validator.isLength(value, { min: 2 })) {
          throw new Error("name 至少 2 個字元以上");
        }
        break;
      case "sex":
        if (!["male", "female"].includes(value)) {
          throw new Error("sex 只能是 male 或 female");
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
      default:
        break;
    }
  }
};
