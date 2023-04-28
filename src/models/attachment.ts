import { Schema, model } from "mongoose";

interface IAttachment extends Document {
  dirname: string;
  filename: string;

  cardId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
}

const attachmentSchema = new Schema<IAttachment>(
  {
    dirname: {
      type: String,
      required: [true, "dirname 未填寫"],
    },
    filename: {
      type: String,
      required: [true, "filename 未填寫"],
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

export default model("attachment", attachmentSchema);
