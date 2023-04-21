import { Schema, model } from "mongoose";
import { IMember } from "@/models/user";

interface IOrganization extends Document {
  name: string;
  permission: "private" | "public";

  member: IMember[];
  board: Schema.Types.ObjectId;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: [true, "name 未填寫"] },
    permission: { type: String, default: "private" },
  },
  { versionKey: false, timestamps: true }
);

export default model("organization", organizationSchema);
