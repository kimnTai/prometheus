import { Schema, model } from "mongoose";
import { IMember } from "@/models/user";

interface IBoard extends Document {
  name: string;
  permission: "private" | "public";
  closed: boolean;

  member: IMember[];
  organizationId: Schema.Types.ObjectId;
}

const boardSchema = new Schema<IBoard>(
  {
    name: {
      type: String,
      required: [true, "name 未填寫"],
    },
    permission: {
      type: String,
      default: "private",
    },
    closed: {
      type: Boolean,
      default: false,
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
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "organization",
      required: [true, "organizationId 未填寫"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

boardSchema.virtual("list", {
  ref: "list",
  foreignField: "boardId",
  localField: "_id",
});

boardSchema.virtual("label", {
  ref: "label",
  foreignField: "boardId",
  localField: "_id",
});

export default model("board", boardSchema);
