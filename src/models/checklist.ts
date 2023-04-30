import { Schema, model, type Document } from "mongoose";

interface IChecklist extends Document {
  name: string;
  completed: Boolean;
  position: number;

  cardId: Schema.Types.ObjectId;
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
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

checklistSchema.virtual("checkItem", {
  ref: "checkItem",
  foreignField: "checklistId",
  localField: "_id",
});

export default model("checklist", checklistSchema);
