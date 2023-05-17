import { http } from "./http.js";
import { get_取得使用者所有組織資料 } from "./main.js";

export async function post_卡片_產生附件(cardId) {
  const data = Array.from({ length: 3 }, (_) => {
    const arr = [
      "https://i.imgur.com/rZaKq8K.jpeg",
      "https://i.imgur.com/ofjoUs2.jpeg",
      "https://i.imgur.com/jdjS2yy.png",
    ];
    return {
      dirname: arr[~~(Math.random() * 3)],
      filename: `附件：${~~(Math.random() * 100)}`,
    };
  }).map((body) => {
    return http({
      method: "POST",
      url: `/api/cards/${cardId}/attachments`,
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
    return post_卡片_產生附件(id);
  });

  const res = await Promise.all(arr);

  console.log(JSON.stringify(res));
}
