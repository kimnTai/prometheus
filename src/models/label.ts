import { Schema, model } from "mongoose";

interface ILabel extends Document {
  name: string;
  color: string;

  boardId: Schema.Types.ObjectId;
}

const labelSchema = new Schema<ILabel>(
  {
    name: {
      type: String,
      required: [true, "name 未填寫"],
    },
    color: {
      type: String,
      default: "#ffffff",
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "board",
      required: [true, "boardId 未填寫"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("label", labelSchema);
