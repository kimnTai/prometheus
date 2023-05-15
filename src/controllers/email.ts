import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { generateToken, verifyToken } from "@/shared";
import UsersModel from "@/models/user";

import type { Request, RequestHandler, Response } from "express";

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  auth: {
    user: process.env.MAILER_ACCOUNT,
    pass: process.env.MAILER_PASSWORD,
  },
});

export const sendResetPasswordEmail: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Email"]
   * #swagger.description  = "重設密碼"
   */
  const email = req.body.email;

  const newPassword = Date.now();

  const userInfo = await UsersModel.findOneAndUpdate(
    { email },
    { password: await bcrypt.hash(`${newPassword}`, 12) }
  );

  if (userInfo) {
    // await transporter.sendMail({
    //   from: "Lunar@Lunar.mailgun.org",
    //   to: email,
    //   subject: "Register Success",
    //   html: `
    //         Congratulations on your successful registration.
    //         <br>
    //         <h1>password: ${newPassword}</h1>
    //         <br>
    //         <br>
    //         Website: <a href="https://www.google.com/">PROMETHEUS</a>
    //       `,
    // });
  }

  res.send({ status: "success", message: "密碼重設成功" });
};

// 發送註冊成功 email
export const sendEmailVerification = async (req: Request, _res: Response) => {
  return;
  const email = req.body.email;

  const token = generateToken({ email });

  const href = `${req.headers.host}/api/email/emailVerification/${token}`;

  await transporter.sendMail({
    from: "Lunar@Lunar.mailgun.org",
    to: email,
    subject: "註冊成功",
    html: `<p>
            您要求進行電子郵件驗證，請使用此
            <a href="${href}">鏈接</a>
            驗證您的電子郵件地址
          </p>`,
  });
};

export const emailVerification: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Email"]
   * #swagger.description  = "email 驗證連結"
   */
  const result = verifyToken(req.params.token);

  if (!result.email) {
    throw new Error("token 錯誤");
  }

  const userInfo = await UsersModel.findOneAndUpdate(
    { email: result.email },
    { isEmailVerification: true }
  );

  res.send({ status: "success", message: "email 驗證成功!", result, userInfo });
};

export const resendEmailVerification: RequestHandler = async (req, res) => {
  /**
   * #swagger.tags = ["Email"]
   * #swagger.description  = "重新發送 email 驗證"
   */
  const result = await UsersModel.findById(req.params.userId);

  if (!result) {
    throw new Error("無此使用者 id");
  }

  // const token = generateToken({ email: result?.email });

  // const href = `${req.headers.host}/api/email/emailVerification/${token}`;

  // await transporter.sendMail({
  //   from: "Lunar@Lunar.mailgun.org",
  //   to: result?.email,
  //   subject: "驗證 Email",
  //   html: `<p>
  //           您要求進行電子郵件驗證，請使用此
  //           <a href="${href}">鏈接</a>
  //           驗證您的電子郵件地址
  //         </p>`,
  // });

  res.send({ status: "success", message: "已發送驗證 Email" });
};
