import { Schema, model } from "mongoose";

interface INotification extends Document {
  text: string;
  isRead: boolean;

  userId: Schema.Types.ObjectId;
  actionId: Schema.Types.ObjectId;
}

const notificationSchema = new Schema<INotification>(
  {
    text: {
      type: String,
      required: [true, "event 未填寫"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "userId 未填寫"],
    },
    actionId: {
      type: Schema.Types.ObjectId,
      ref: "action",
      required: [true, "actionId 未填寫"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("notification", notificationSchema);
