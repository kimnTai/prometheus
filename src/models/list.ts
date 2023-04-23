import { Schema, model } from "mongoose";

interface IList extends Document {
  name: string;
  closed: boolean;
  position: number;

  boardId: Schema.Types.ObjectId;
  card: Schema.Types.ObjectId[];
}

const listSchema = new Schema<IList>(
  {
    name: { type: String, required: [true, "name 未填寫"] },
    closed: { type: Boolean, default: false },
    position: { type: Number, default: 0 },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "board",
      required: [true, "boardId 未填寫"],
    },
    card: [
      {
        type: Schema.Types.ObjectId,
        ref: "card",
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

export default model("list", listSchema);
