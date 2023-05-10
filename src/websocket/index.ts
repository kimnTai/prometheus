import {
  WebSocketServer,
  type WebSocket,
  type ServerOptions,
  type RawData,
} from "ws";

import type { Request, Response, NextFunction } from "express";

export default class Socket extends WebSocketServer {
  static instance?: Socket;
  static isRegister = false;

  static plugin(_req: Request, res: Response, next: NextFunction) {
    if (!Socket.isRegister) {
      Socket.isRegister = true;

      const fn = res.app.emit;
      res.app.emit = (eventName: string | symbol, ...args: any[]) => {
        Socket.instance?.clients.forEach((value) => {
          value.emit(eventName, ...args);
        });
        return fn.call(res.app, eventName, ...args);
      };
    }

    return next();
  }

  static build(options: ServerOptions) {
    Socket.instance = new Socket(
      {
        ...options,
        path: "/socket",
      },
      () => console.log("[socket 開始]")
    );

    Socket.instance.on("connection", (client) => {
      client.send(JSON.stringify({ type: "success" }));

      client.on("message", (data) => {
        this.handleClientMessage(client, data);
      });
    });
  }

  static handleClientMessage(client: WebSocket, data: RawData) {
    const message = JSON.parse(data.toString()) as {
      type: string;
      boardIdArray?: string[];
    };

    if (message.type === "subscribe") {
      client.send(JSON.stringify({ type: "success" }));

      message.boardIdArray?.forEach((id) => {
        client.on(`boardId:${id}`, (param) => {
          const update = { type: "update", result: param };

          client.send(JSON.stringify(update));
        });
      });
    }
  }
}
