import { Schema, model, type Document } from "mongoose";
import { IMember } from "@/models/user";

interface IOrganization extends Document {
  name: string;
  permission: "private" | "public";

  member: IMember[];
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: [true, "組織 name 未填寫"],
    },
    permission: {
      type: String,
      enum: ["private", "public"],
      default: "private",
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
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

organizationSchema.virtual("board", {
  ref: "board",
  foreignField: "organizationId",
  localField: "_id",
});

organizationSchema.pre(/^find/, function (next) {
  this.populate({
    path: "board",
  });
  this.populate({
    path: "member.userId",
    select: "name avatar email",
  });
  next();
});

export default model("organization", organizationSchema);
