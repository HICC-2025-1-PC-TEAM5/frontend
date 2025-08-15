import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ 오타 수정
  withCredentials: true, // ✅ 세미콜론 → 콤마
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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

/** 레시피 추천: POST /api/users/{userId}/recipes
 * @returns {Promise<{recipe:Array}>}
 */
export async function fetchRecommendedRecipes(userId, { sort } = {}) {
  try {
    const { data } = await api.post(
      `/api/users/${userId}/recipes`,
      null,
      sort ? { params: { sort } } : undefined
    );
    return data; // { recipe: [...] }
  } catch (err) {
    toReadableError(err);
  }
}

/** 레시피 상세: GET /api/users/{userId}/recipes/{recipeId}
 * @returns {Promise<{recipe: {...}, recipeGuide: {steps: [...]}}>}
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

// 공용 axios 인스턴스를 다른 모듈에서도 쓰려면 export
export default api;
