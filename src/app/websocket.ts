import type { Application, NextFunction, Request, Response } from "express";
import {
  WebSocketServer,
  type RawData,
  type ServerOptions,
  type WebSocket,
} from "ws";

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

      client.on("message", (data) => {
        if (!data.toString()) {
          client.send("");
        }

        try {
          Socket.handleClientMessage(client, data);
        } catch (error) {
          let message = "";

          if (error instanceof Error) {
            message = error.message;
          }

          client.send(JSON.stringify({ type: "error", message }));
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

  private static handleClientMessage(client: WebSocket, data: RawData) {
    interface ClientMessage {
      type: string;
      boardId?: string;
    }

    const message = JSON.parse(data.toString()) as ClientMessage;

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

    if (message.type === "unsubscribe" && message.boardId) {
      const eventName = `boardId:${message.boardId}`;
      client.removeAllListeners(eventName);
      client.send(JSON.stringify({ type: "success" }));
    }

    if (message.type === "ping") {
      client.send(JSON.stringify({ type: "ping" }));
    }
  }
}
