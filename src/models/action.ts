import { Schema, model, type Document } from "mongoose";

interface IAction extends Document {
  event: string;
  data: string;

  cardId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
}

const actionSchema = new Schema<IAction>(
  {
    event: {
      type: String,
      required: [true, "event 未填寫"],
    },
    data: {
      type: String,
      required: [true, "data 未填寫"],
    },

    cardId: {
      type: Schema.Types.ObjectId,
      ref: "card",
      required: [true, "cardId 未填寫"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "card",
      required: [true, "userId 未填寫"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("action", actionSchema);
