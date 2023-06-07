import Redis from "@/app/redis";

export const getRecentBoardsItems = async (data: { userId: string }) => {
  const key = `userId:${data.userId}/RecentBoards`;

  const value = (await Redis.get(key)) ?? "[]";

  const item = JSON.parse(value) as string[];

  return item;
};

export const generateRecentBoards = async (data: {
  userId: string;
  boardId: string;
}) => {
  const key = `userId:${data.userId}/RecentBoards`;

  const item = await getRecentBoardsItems({ userId: data.userId });

  const result = item.filter((id) => id !== data.boardId);

  const MAX_LENGTH = 8;

  if (result.length > MAX_LENGTH) {
    result.shift();
  }

  result.push(data.boardId);

  await Redis.set(key, JSON.stringify(result));
};
