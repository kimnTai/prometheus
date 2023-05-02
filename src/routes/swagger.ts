import swaggerUi from "swagger-ui-express";
import swaggerSpec from "@develop/swagger_output.json";
import { createRouter } from "@/shared";

import type { Request, Response, NextFunction } from "express";

const router = createRouter();

router.use(
  "/swagger",
  swaggerUi.serve,
  (req: Request, res: Response, next: NextFunction) => {
    swaggerSpec.host = `${req.headers.host}`;

    if (import.meta.env.PROD) {
      swaggerSpec.schemes = ["https"];
    }

    swaggerUi.setup(swaggerSpec)(req, res, next);
  }
);

export default router;
