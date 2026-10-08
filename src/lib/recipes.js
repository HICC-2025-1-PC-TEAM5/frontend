// 공용 클라이언트: Bearer 자동 첨부 + 401/419 시 refresh 후 1회 재시도 (F3)
import api from './api';

function toReadableError(err) {
  if (err?.response) {
    const { status, data } = err.response;
    const serverMsg = typeof data === 'string' ? data : data?.message || ''; // ✅ 변수명 정리(선택)
    const msgMap = {
      400: '잘못된 요청',
      401: '로그인 필요',
      403: '권한 없음',
      404: '찾을 수 없음',
      408: '요청 시간 초과',
    };
    const fallback = `요청 실패 (${status})`;
    const message = msgMap[status] || fallback;
    const e = new Error(serverMsg || message);
    e.status = status;
    throw e;
  }
  if (err?.code === 'ECONNABORTED') {
    const e = new Error('요청 시간 초과');
    e.status = 408;
    throw e;
  }
  throw err;
}

/** 레시피 추천: GET /api/users/{userId}/recipes
 * 재료는 서버가 사용자 냉장고에서 고르고, 알레르기·싫어요 레시피도 서버가 거른다 (C1, D-018)
 * @returns {Promise<{recipe:Array}>}
 */
export async function fetchRecommendedRecipes(userId) {
  try {
    const { data } = await api.get(`/api/users/${userId}/recipes`);
    return data; // { recipe: [...] }
  } catch (err) {
    toReadableError(err);
  }
}

/** 레시피 상세: GET /api/users/{userId}/recipes/{recipeId}
 * @returns {Promise<{recipe: {...}, recipeGuide: {steps: [...]}, expiredIngredients: string[]}>}
 */
export async function fetchRecipeDetail(userId, recipeId) {
  try {
    const { data } = await api.get(`/api/users/${userId}/recipes/${recipeId}`);
    return data;
  } catch (err) {
    toReadableError(err);
  }
}

/** 선호도 PATCH: /api/users/{userId}/recipes/{recipeId}
 * body: { type: "좋아요" | "싫어요" }
 */
export async function patchRecipePreference(userId, recipeId, type) {
  try {
    const { data } = await api.patch(
      `/api/users/${userId}/recipes/${recipeId}`,
      { type }
    );
    return data; // { message: "OK" }
  } catch (err) {
    toReadableError(err);
  }
}
