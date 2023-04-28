import { Schema, model } from "mongoose";

interface IChecklist extends Document {
  name: string;
  completed: Boolean;
  position: number;

  cardId: Schema.Types.ObjectId;
  checkItem: Schema.Types.ObjectId[];
}

const checklistSchema = new Schema<IChecklist>(
  {
    name: {
      type: String,
      required: [true, "name 未填寫"],
    },
    position: {
      type: Number,
      default: 0,
    },

    cardId: {
      type: Schema.Types.ObjectId,
      ref: "card",
      required: [true, "cardId 未填寫"],
    },
    checkItem: [
      {
        type: Schema.Types.ObjectId,
        ref: "checkItem",
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("checklist", checklistSchema);
