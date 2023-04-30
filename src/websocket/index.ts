import { WebSocketServer, type ServerOptions } from "ws";

export default class Socket extends WebSocketServer {
  array: string[] = [];

  constructor(options: ServerOptions, callback: () => void) {
    super(
      {
        ...options,
        port: options.server ? undefined : Number(process.env.PORT) + 1,
      },
      callback
    );

    this.on("connection", (socket) => {
      socket.send(JSON.stringify(this.array));

      socket.on("message", (data) => {
        const message = data.toString();
        this.array.push(message);
        if (this.array.length > 20) {
          this.array.shift();
        }
        this.clients.forEach((value) => {
          value.send(message);
        });
      });
    });
  }
}
