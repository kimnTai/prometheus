import express from "express";
import cors from "cors";
import morgan from "morgan";
import "@/app/env";
import "@/connection";
import "@/models";
import * as Routes from "@/routes";
import * as Exception from "@/exception";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));

app.use("/api", Routes.api);
app.get("/", (_, res) => {
  res.send("Hello Prometheus!");
});
app.get("/favicon.ico", (_, res) => {
  res.end();
});

app.use(Exception.sendNotFoundError);
app.use(Exception.catchCustomError);

if (import.meta.env.PROD) {
  app.listen(process.env.PORT);
  console.log(`listening on http://localhost:${process.env.PORT}`);
}
