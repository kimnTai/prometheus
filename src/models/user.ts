import { Schema, model, type Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  isEmailVerification: boolean;
  password: string;
  avatar: string;
  googleId?: string;
}

export interface IMember extends Document {
  userId: IUser["id"];
  role: "editor " | "viewer" | "manager";
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "name 未填寫"],
    },
    email: {
      type: String,
      required: [true, "email 未填寫"],
    },
    isEmailVerification: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "password 未填寫"],
      select: false,
    },
    avatar: {
      type: String,
      default: "https://i.imgur.com/tPmUQVM.png",
    },
    googleId: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("user", userSchema);
