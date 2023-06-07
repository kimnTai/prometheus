import { createClient } from "redis";

export type RedisClientType = ReturnType<typeof createClient>;

export default class Redis {
  static instance?: RedisClientType;

  static async build() {
    try {
      Redis.instance = createClient({
        url: process.env.REDIS_URL,
      });
      await Redis.instance.connect();
      console.log("[redis 連線成功]");
    } catch (error) {
      let message = "";

      if (error instanceof Error) {
        message = error.message;
      }
      Redis.instance = undefined;
      console.log("[redis 連線錯誤]", message);
    }
  }

  static set(key: string, value: string) {
    return Redis.instance?.set(key, value);
  }

  static get(key: string) {
    return Redis.instance?.get(key);
  }
}
