import { http } from "./http.js";

export async function get_取得使用者所有組織資料() {
  const res = await http({
    method: "GET",
    url: "/api/organizations/user",
  });

  const total = res.result
    .flatMap((v) => v.board)
    .map(({ id, organizationId, label, list }) => ({
      id,
      organizationId,
      label,
      list,
    }))
    .map(({ list, ...args }) => {
      const _list = list.map(({ id, card, position, boardId }) => {
        const _card = card.map(
          ({ _id, closed, member, createdAt, updatedAt, ...args2 }) => ({
            ...args2,
          })
        );

        return {
          id,
          boardId,
          position,
          card: _card,
        };
      });
      return { list: _list, ...args };
    });

  return total;
}

async function main() {
  const userTotalBoard = await get_取得使用者所有組織資料();

  const labelsIdList = userTotalBoard.map((v) => v.label.map((a) => a._id));

  const cardList = userTotalBoard.flatMap((v) =>
    v.list.flatMap((a) =>
      a.card.map(({ id, checklist }) => ({ id, checklist }))
    )
  );

  // 都 null 正常
  console.log(JSON.stringify(userTotalBoard));
}
