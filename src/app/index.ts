import express from "express";
import cors from "cors";
import morgan from "morgan";
import "@/app/env";
import "@/connection";
import "@/models";
import { apiRouter } from "@/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("tiny"));

app.use("/api", apiRouter);

app.get("/", (_, res) => {
  res.send("Hello Prometheus!");
});

if (import.meta.env.PROD) {
  app.listen(process.env.PORT);
  console.log(`listening on http://localhost:${process.env.PORT}`);
}

export const viteNodeApp = app;
