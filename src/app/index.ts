import express from "express";
import cors from "cors";
import morgan from "morgan";
import "@/app/env";
import "@/app/connection";
import Routes from "@/routes";
import * as Exception from "@/app/exception";
import Socket from "@/app/websocket";
import Redis from "./redis";

export const app = express();

app.set("views", "src/views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));

app.use(Socket.plugin);
app.use(Routes);

app.use(Exception.sendNotFoundError);
app.use(Exception.catchCustomError);

Redis.build();

let server = undefined;

if (import.meta.env.PROD) {
  server = app.listen(process.env.PORT);
  console.log(`listening on http://localhost:${process.env.PORT}`);

  //FIXME:dev 時 vite 熱重載機制會讓 ws 產生問題
  Socket.build({ server });
}
