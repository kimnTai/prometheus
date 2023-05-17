import { http } from "./http.js";

const POSITION_GAP = 65535;

export async function post_創建清單與事項(cardId, index) {
  const arr = Array.from({ length: 3 }, (_, i) => {
    return {
      name: `清單 ${index + i} : ${~~(Math.random() * 100)}`,
      position: POSITION_GAP * (1 + index + i),
    };
  }).map(async (body) => {
    const res = await http({
      method: "POST",
      url: `/api/cards/${cardId}/checklist`,
      body,
    });
    return await post_創建代辦事項(cardId, res.result._id);
  });

  return await Promise.all(arr);
}

async function post_創建代辦事項(cardId, checklistId) {
  const arr = Array.from({ length: 3 }, (_, i) => {
    return {
      name: `事項 ${i} : ${~~(Math.random() * 100)}`,
      position: POSITION_GAP * (1 + i),
    };
  }).map(async (body) => {
    await http({
      method: "POST",
      url: `/api/cards/${cardId}/checklist/${checklistId}/checkItem`,
      body,
    });
  });

  return await Promise.all(arr);
}

async function main() {
  const userTotalBoard = await get_取得使用者所有組織資料();

  const labelsIdList = userTotalBoard.map((v) => v.label.map((a) => a._id));

  const cardList = userTotalBoard.flatMap((v) =>
    v.list.flatMap((a) =>
      a.card.map(({ id, checklist }) => ({ id, checklist }))
    )
  );

  const arr = cardList.map(({ id, checklist }) => {
    return post_創建清單與事項(id, checklist.length);
  });

  const res = await Promise.all(arr);

  // 都 null 正常
  console.log(JSON.stringify(res));
}
