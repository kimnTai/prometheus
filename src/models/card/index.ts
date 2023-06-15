import { Schema, model, type Document } from "mongoose";
import { IMember } from "@/models/user";
import { IChecklist } from "./checklist";
import { ILabel } from "../label";
import { IAttachment } from "./attachment";

export interface ICard extends Document {
  name: string;
  description: string;
  closed: boolean;
  position: number;

  boardId: Schema.Types.ObjectId;
  listId: Schema.Types.ObjectId;
  member: IMember[];
  label: ILabel[];
  checklist: IChecklist[];
  attachment: IAttachment[];
}

const cardSchema = new Schema<ICard>(
  {
    name: {
      type: String,
      required: [true, "name 未填寫"],
    },
    description: {
      type: String,
      default: "",
    },
    closed: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Number,
      default: 0,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "board",
      required: [true, "boardId 未填寫"],
    },
    listId: {
      type: Schema.Types.ObjectId,
      ref: "list",
      required: [true, "listId 未填寫"],
    },
    member: [
      {
        _id: false,
        userId: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        role: {
          type: String,
          enum: ["editor", "viewer", "manager"],
          default: "viewer",
        },
      },
    ],
    label: [
      {
        type: Schema.Types.ObjectId,
        ref: "label",
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

cardSchema.virtual("checklist", {
  ref: "checklist",
  foreignField: "cardId",
  localField: "_id",
});

cardSchema.virtual("comment", {
  ref: "comment",
  foreignField: "cardId",
  localField: "_id",
});

cardSchema.virtual("attachment", {
  ref: "attachment",
  foreignField: "cardId",
  localField: "_id",
});

cardSchema.virtual("date", {
  ref: "date",
  foreignField: "cardId",
  localField: "_id",
  justOne: true,
});

// 前置查詢
cardSchema.pre(/^find/, function (next) {
  const shouldPopulate = this.getOptions().shouldPopulate ?? true;
  if (!shouldPopulate) {
    next();
    return;
  }

  this.populate({
    path: "label",
    select: "name color",
  });
  this.populate({
    path: "member.userId",
    select: "name avatar email",
  });
  this.populate({
    path: "comment",
  });
  this.populate({
    path: "checklist",
    select: "name completed position",
  });
  this.populate({
    path: "attachment",
    select: "dirname filename userId",
  });
  this.populate({
    path: "date",
    select: "startDate dueDate dueComplete dueReminder",
  });
  next();
});

export default model("card", cardSchema);
