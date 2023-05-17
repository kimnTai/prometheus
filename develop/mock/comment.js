import { http } from "./http.js";

export async function post_卡片_產生留言(cardId, cardCommentLength) {
  const data = Array.from({ length: 3 }, (_, i) => {
    return { comment: `留言 ${cardCommentLength + i} : ${new Date()}` };
  }).map((body) => {
    return http({
      method: "POST",
      url: `/api/cards/${cardId}/comments`,
      body,
    });
  });

  return await Promise.all(data);
}
