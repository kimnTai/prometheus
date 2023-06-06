import { Schema, model, type Document } from "mongoose";
import { ICard } from "./card";

export interface IList extends Document {
  name: string;
  closed: boolean;
  position: number;

  boardId: Schema.Types.ObjectId;
  card: ICard[];
}

const listSchema = new Schema<IList>(
  {
    name: {
      type: String,
      required: [true, "name 未填寫"],
    },
    closed: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Number,
      default: 0,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

listSchema.virtual("card", {
  ref: "card",
  foreignField: "listId",
  localField: "_id",
});

listSchema.pre(/^find/, function (next) {
  this.populate({
    path: "card",
    match: {
      closed: false,
    },
  });
  next();
});

export default model("list", listSchema);
