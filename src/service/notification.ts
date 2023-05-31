import NotificationModel from "@/models/notification";

export const generateNotification = async (data: {
  isRead?: boolean;
  type: "ADD_MEMBER" | "REMOVE_MEMBER" | "UPDATE_ROLE";
  data: {
    organization?: {
      id: string;
      name: string;
      role?: string;
    };
    board?: {
      id: string;
      name: string;
      role?: string;
    };
    card?: {
      id: string;
      name: string;
    };
  };

  userId: string;
  sourceUserId: string;
}) => {
  return await NotificationModel.create(data);
};

export const getUserNotification = async (data: { userId: string }) => {
  return await NotificationModel.find(data);
};

export const updateOneNotification = async (data: {
  notificationId: string;
  isRead: boolean;
}) => {
  return await NotificationModel.findByIdAndUpdate(
    data.notificationId,
    {
      isRead: data.isRead,
    },
    { new: true, runValidators: true }
  );
};

export const deleteOneNotification = async (data: {
  notificationId: string;
}) => {
  return await NotificationModel.findByIdAndDelete(data.notificationId);
};
