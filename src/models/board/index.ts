import { Schema, model, type Document } from "mongoose";
import { IMember } from "@/models/user";
import { IList } from "../list";
import { ILabel } from "../label";

export interface IBoard extends Document {
  name: string;
  permission: "private" | "public";
  closed: boolean;
  inviteLink: string;
  image: string;

  member: IMember[];
  organizationId: Schema.Types.ObjectId;
  list: IList[];
  label: ILabel[];
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
    image: {
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
  const shouldPopulate = this.getOptions().shouldPopulate ?? true;
  if (!shouldPopulate) {
    next();
    return;
  }

  this.populate({
    path: "member.userId",
    select: "name avatar email",
  });

  next();
});

export default model("board", boardSchema);
