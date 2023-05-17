import { http } from "./http.js";
import { get_取得使用者所有組織資料 } from "./main.js";

export async function post_卡片_產生日期(cardId) {
  const data = Array.from({ length: 1 }, (_) => {
    return { startDate: new Date(), dueDate: new Date("2023/06/18") };
  }).map((body) => {
    return http({
      method: "POST",
      url: `/api/cards/${cardId}/date`,
      body,
    });
  });

  return await Promise.all(data);
}

async function main() {
  const userTotalBoard = await get_取得使用者所有組織資料();

  const labelsIdList = userTotalBoard.map((v) => v.label.map((a) => a._id));

  const cardList = userTotalBoard.flatMap((v) =>
    v.list.flatMap((a) => a.card.map(({ id }) => ({ id })))
  );

  const arr = cardList.map(({ id }) => {
    return post_卡片_產生日期(id);
  });

  const res = await Promise.all(arr);

  console.log(JSON.stringify(res));
}
