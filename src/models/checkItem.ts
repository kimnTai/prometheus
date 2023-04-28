import { Schema, model } from "mongoose";

interface ICheckItem extends Document {
  name: string;
  completed: Boolean;
  position: number;

  checklistId: Schema.Types.ObjectId;
}

const checkItemSchema = new Schema<ICheckItem>(
  {
    name: {
      type: String,
      required: [true, "name 未填寫"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Number,
      default: 0,
    },

    checklistId: {
      type: Schema.Types.ObjectId,
      ref: "checklist",
      required: [true, "checklistId 未填寫"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("checkItem", checkItemSchema);
