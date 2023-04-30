/// <reference types="vite/client" />

import { IUser } from "@/models/user";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;

      HOST: string;
      PORT: number;

      DATABASE: string;
      DATABASE_PASSWORD: string;

      JWT_EXPIRES_DAY: string;
      JWT_SECRET: string;

      IMGUR_REFRESH_TOKEN: string;
      IMGUR_ALBUM_ID: string;

      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      GOOGLE_LOGIN_CALL_BACK_URL: string;

      MAILER_ACCOUNT: string;
      MAILER_PASSWORD: string;

      CLIENT_LOGIN_CALLBACK_URL: string;
    }
  }

  namespace Express {
    interface User extends IUser {}
  }
}
