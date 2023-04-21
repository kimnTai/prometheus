import { createRouter } from "@/shared";
import express from "express";

export const apiRouter = Object.values<{
  path: string;
  router: express.Router;
}>(import.meta.glob("./api/*.ts", { eager: true })).reduce(
  (previousValue, { path, router }) => previousValue.use(path, router),
  createRouter()
);
