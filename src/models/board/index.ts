import { Schema, model, type Document } from "mongoose";
import { IMember } from "@/models/user";

interface IBoard extends Document {
  name: string;
  permission: "private" | "public";
  closed: boolean;
  inviteLink: string;

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
      enum: ["private", "public"],
      default: "private",
    },
    closed: {
      type: Boolean,
      default: false,
    },
    inviteLink: {
      type: String,
      default: "",
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

boardSchema.pre(/^find/, function (next) {
  this.populate({
    path: "member.userId",
    select: "name avatar email",
  });
  this.populate({
    path: "list",
    select: "-createdAt -updatedAt",
  });
  this.populate({
    path: "label",
    select: "-createdAt -updatedAt",
  });

  next();
});

export default model("board", boardSchema);
