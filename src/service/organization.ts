import OrganizationModel from "@/models/organization";

export const getByUser = async ({ userId }: { userId: string }) => {
  return await OrganizationModel.find({
    member: {
      $elemMatch: {
        userId,
      },
    },
  });
};

export const createOne = async ({
  userId,
  name,
  permission,
  userIdList,
}: {
  userId: string;
  name: string;
  permission: string;
  userIdList: string[];
}) => {
  const _result = await OrganizationModel.create({
    name,
    permission,
    member: [
      // 把當前使用者設為管理員
      {
        userId,
        role: "manager",
      },
      // 邀請加入的成員
      ...userIdList.map((userId: string) => ({ userId })),
    ],
  });

  // 需要成員資料，所以 result 用查的
  return await OrganizationModel.findById(_result.id);
};

export const getOne = async ({
  organizationId,
}: {
  organizationId: string;
}) => {
  return await OrganizationModel.findById(organizationId);
};

export const updateOne = async ({
  name,
  permission,
  organizationId,
}: {
  name: string;
  permission: string;
  organizationId: string;
}) => {
  return await OrganizationModel.findByIdAndUpdate(
    organizationId,
    { name, permission },
    { new: true }
  );
};
