import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { checkValidator } from "@/shared";
import UsersModel from "@/models/user";

import type { Request, Response } from "express";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAILER_ACCOUNT,
    pass: process.env.MAILER_PASSWORD,
  },
});

// 重設密碼
export const sendResetPasswordEmail = async (req: Request, res: Response) => {
  const email = req.body.email;

  checkValidator({ email });

  const newPassword = Date.now();

  const userInfo = await UsersModel.findOneAndUpdate(
    { email },
    { password: await bcrypt.hash(`${newPassword}`, 12) }
  );

  if (userInfo) {
    await transporter.sendMail({
      from: "test@gmail.com",
      to: email,
      subject: "Register Success",
      html: `
            Congratulations on your successful registration.
            <br>
            <h1>password: ${newPassword}</h1>
            <br>
            <br>
            Website: <a href="https://www.google.com/">PROMETHEUS</a>
          `,
    });
  }

  res.send({ status: "success", message: "密碼重設成功" });
};

// 發送註冊成功 email
export const sendEmailVerification = async (req: Request, _res: Response) => {
  return;
  const email = req.body.email;

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });

  const href = `${req.headers.host}/api/email/emailVerification/${token}`;

  await transporter.sendMail({
    from: "test@gmail.com",
    to: email,
    subject: "註冊成功",
    html: `<p>
            您要求進行電子郵件驗證，請使用此
            <a href="${href}">鏈接</a>
            驗證您的電子郵件地址
          </p>`,
  });
};

// email 驗證連結
export const emailVerification = async (req: Request, res: Response) => {
  const result = jwt.verify(
    req.params.token,
    process.env.JWT_SECRET
  ) as JwtPayload;

  if (!result.email) {
    throw new Error("token 錯誤");
  }

  const userInfo = await UsersModel.findOneAndUpdate(
    { email: result.email },
    { isEmailVerification: true }
  );

  res.send({ status: "success", message: "email 驗證成功!", result, userInfo });
};
