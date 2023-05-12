import { Schema, model, type Document } from "mongoose";

interface IDate extends Document {
  startDate: Date;
  dueDate: Date;
  dueComplete: boolean;
  dueReminder: number;

  cardId: Schema.Types.ObjectId;
}

const dateSchema = new Schema<IDate>(
  {
    startDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
      required: [true, "dueDate 未填寫"],
    },
    dueComplete: {
      type: Boolean,
      default: false,
    },
    dueReminder: {
      type: Number,
      default: -1,
    },

    cardId: {
      type: Schema.Types.ObjectId,
      ref: "card",
      required: [true, "cardId 未填寫"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("date", dateSchema);
