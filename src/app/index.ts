import express from "express";
import cors from "cors";
import morgan from "morgan";
import "@/app/env";
import "@/connection";
import Routes from "@/routes";
import * as Exception from "@/exception";
import Socket from "@/websocket";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));

app.use(Socket.plugin);
app.use(Routes);

app.use(express.static("public"));

app.use(Exception.sendNotFoundError);
app.use(Exception.catchCustomError);

let server = undefined;

if (import.meta.env.PROD) {
  server = app.listen(process.env.PORT);
  console.log(`listening on http://localhost:${process.env.PORT}`);

  //FIXME:dev 時 vite 熱重載機制會讓 ws 產生問題
  Socket.build({ server });
}
