import { Schema, model } from "mongoose";
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

export default model("organization", organizationSchema);
