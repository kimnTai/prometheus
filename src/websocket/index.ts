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
      client.send(`{ type: "success" }`);

      client.on("message", async (data) => {
        try {
          this.handleClientMessage(client, data);
        } catch (error) {
          client.send(`{ type: "error" }`);
        }
      });
    });
  }

  static handleClientMessage(client: WebSocket, data: RawData) {
    const message = JSON.parse(data.toString()) as {
      type: string;
      boardId?: string;
    };

    if (message.type === "subscribe" && message.boardId) {
      const eventName = `boardId:${message.boardId}`;

      if (client.eventNames().includes(eventName)) {
        return;
      }

      client.on(eventName, (param) => {
        const update = { type: "update", result: param };
        client.send(JSON.stringify(update));
      });

      client.send(`{ type: "success" }`);
    }
  }
}
