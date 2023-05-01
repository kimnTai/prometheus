import { createRouter } from "@/shared";
import healthCheck from "./healthCheck";

import type express from "express";

export const routes = createRouter();

routes.use(healthCheck);

routes.use(
  "/api",
  Object.values<{
    path: string;
    router: express.Router;
  }>(import.meta.glob(`./api/*.ts`, { eager: true })).reduce(
    (previousValue, { path, router }) => previousValue.use(path, router),
    createRouter()
  )
);
