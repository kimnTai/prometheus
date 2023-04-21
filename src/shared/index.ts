import { Router } from "express";

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
