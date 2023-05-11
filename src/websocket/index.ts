import {
  WebSocketServer,
  type WebSocket,
  type ServerOptions,
  type RawData,
} from "ws";

import type { Request, Response, NextFunction, Application } from "express";

export default class Socket extends WebSocketServer {
  static instance?: Socket;

  static plugin(_req: Request, res: Response, next: NextFunction) {
    Socket.instance?.emit("overrideAppMethod", res.app);
    return next();
  }

  static build(options: ServerOptions) {
    Socket.instance = new Socket({
      ...options,
      path: "/socket",
    });

    Socket.instance.on("connection", (client) => {
      client.send(JSON.stringify({ type: "success" }));

      client.on("message", async (data) => {
        if (!data.toString()) {
          client.send("");
        }

        try {
          Socket.handleClientMessage(client, data);
        } catch (error) {
          client.send(JSON.stringify({ type: "error" }));
        }
      });
    });

    Socket.instance.once("overrideAppMethod", (app: Application) => {
      const fn = app.emit;
      app.emit = (eventName: string | symbol, ...args: any[]) => {
        Socket.instance?.clients.forEach((value) => {
          value.emit(eventName, ...args);
        });
        return fn.call(app, eventName, ...args);
      };
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

      client.send(JSON.stringify({ type: "success" }));
    }
  }
}
