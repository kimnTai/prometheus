import { Schema, model, type Document } from "mongoose";

export interface INotification extends Document {
  isRead?: boolean;
  type: "ADD_MEMBER" | "REMOVE_MEMBER" | "UPDATE_ROLE";
  data: {
    organization?: {
      id: string;
      name: string;
      role: string;
    };
    board?: {
      id: string;
      name: string;
      role: string;
    };
    card?: {
      id: string;
      name: string;
    };
  };

  userId: Schema.Types.ObjectId;
  sourceUserId: Schema.Types.ObjectId;
}

const notificationSchema = new Schema<INotification>(
  {
    isRead: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: [true, "type 未填寫"],
      enum: ["ADD_MEMBER", "REMOVE_MEMBER", "UPDATE_ROLE"],
    },
    data: {
      type: Object,
      required: [true, "data 未填寫"],
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "userId 未填寫"],
    },
    sourceUserId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "sourceUserId 未填寫"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

notificationSchema.pre(/^find/, function (next) {
  this.populate({
    path: "userId",
  });
  this.populate({
    path: "sourceUserId",
  });
  next();
});

export default model("notification", notificationSchema);
