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
}

const cardSchema = new Schema<ICard>(
  {
    name: {
      type: String,
      required: [true, "name 未填寫"],
    },
    closed: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Number,
      default: 0,
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

export default model("card", cardSchema);
