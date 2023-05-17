import { http } from "./http.js";

export async function post_看板_產生標籤(boardId, boardLabelsLength) {
  const data = Array.from({ length: 3 }, (_, i) => {
    const list = [
      "#FF0000",
      "#FFFF00",
      "#00FFFF",
      "#4682B4",
      "#D94DFF",
      "#66FF00",
      "#FFBF00",
      "#808000",
      "#FF7F50",
    ];
    const _index = 1 + Math.floor(Math.random() * list.length);
    return {
      name: `標籤${i + boardLabelsLength}`,
      color: list[_index],
      boardId,
    };
  }).map((body) => {
    return http({
      method: "POST",
      url: `/api/boards/${boardId}/labels`,
      body,
    });
  });

  return await Promise.all(data);
}

export async function post_卡片_新增標籤(cardId, labelId) {
  return await http({
    method: "POST",
    url: `/api/cards/${cardId}/labels/${labelId}`,
    body: {
      labelId,
    },
  });
}

async function main() {
  const userTotalBoard = await get_取得使用者所有組織資料();
  const labelsIdList = userTotalBoard.map((v) => v.label.map((a) => a._id));

  const cardList = userTotalBoard.map((v) =>
    v.list.flatMap((a) => a.card.map((v) => v.id))
  );

  const arr = cardList.flatMap((v, index) => {
    const arr = labelsIdList[index];

    return v.map((element) => {
      return post_卡片_新增標籤(
        element,
        arr[1 + Math.floor(Math.random() * arr.length)]
      );
    });
  });

  const res = await Promise.all(arr);

  console.log(res);
}
