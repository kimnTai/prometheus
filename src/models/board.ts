import { Schema, model } from "mongoose";
import { IMember } from "@/models/user";

interface IBoard extends Document {
  name: string;
  permission: "private" | "public";
  closed: boolean;

  member: IMember[];
  organizationId: Schema.Types.ObjectId;
  list: Schema.Types.ObjectId[];
  label: Schema.Types.ObjectId[];
}

const boardSchema = new Schema<IBoard>(
  {
    name: { type: String, required: [true, "name 未填寫"] },
    permission: { type: String, default: "private" },
    closed: { type: Boolean, default: false },
    member: [
      {
        _id: false,
        userId: { type: Schema.Types.ObjectId, ref: "user" },
        role: { type: String, default: "viewer" },
      },
    ],
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "organization",
      required: [true, "organizationId 未填寫"],
    },
    list: [
      {
        type: Schema.Types.ObjectId,
        ref: "list",
      },
    ],
    label: [
      {
        type: Schema.Types.ObjectId,
        ref: "label",
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

export default model("board", boardSchema);
