import { Schema, model } from "mongoose";
import { IMember } from "@/models/user";

interface ICard extends Document {
  name: string;
  description: string;
  closed: boolean;
  position: number;
  color: string;

  listId: Schema.Types.ObjectId;
  member: IMember[];
  label: Schema.Types.ObjectId[];
  checklist: Schema.Types.ObjectId[];
  comment: Schema.Types.ObjectId[];
  attachment: Schema.Types.ObjectId[];
}

const cardSchema = new Schema<ICard>(
  {
    name: { type: String, required: [true, "name 未填寫"] },
    closed: { type: Boolean, default: false },
    position: { type: Number, default: 0 },
    listId: {
      type: Schema.Types.ObjectId,
      ref: "list",
      required: [true, "listId 未填寫"],
    },
    member: [
      {
        _id: false,
        userId: { type: Schema.Types.ObjectId, ref: "user" },
        role: { type: String, default: "viewer" },
      },
    ],
    label: [
      {
        type: Schema.Types.ObjectId,
        ref: "label",
      },
    ],
    checklist: [
      {
        type: Schema.Types.ObjectId,
        ref: "checklist",
      },
    ],
    comment: [
      {
        type: Schema.Types.ObjectId,
        ref: "comment",
      },
    ],
    attachment: [
      {
        type: Schema.Types.ObjectId,
        ref: "attachment",
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

export default model("card", cardSchema);
