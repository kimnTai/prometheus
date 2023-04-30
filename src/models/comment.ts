import { Schema, model, type Document } from "mongoose";

interface IComment extends Document {
  comment: string;

  cardId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
}

const commentSchema = new Schema<IComment>(
  {
    comment: {
      type: String,
      required: [true, "comment 未填寫"],
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

export default model("comment", commentSchema);
