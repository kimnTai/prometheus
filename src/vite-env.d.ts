/// <reference types="vite/client" />

declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;

    HOST: string;
    PORT: number;

    DATABASE: string;
    DATABASE_PASSWORD: string;

    JWT_EXPIRES_DAY: string;
    JWT_SECRET: string;

    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_LOGIN_CALL_BACK_URL: string;

    MAILER_ACCOUNT: string;
    MAILER_PASSWORD: string;
  }
}
