// src/lib/favorites.js
import api from './api';

function toReadableError(err) {
  if (err?.response) {
    const { status, data } = err.response;
    const serverMsg = typeof data === 'string' ? data : data?.message || '';
    const map = {
      400: '잘못된 요청(400)',
      401: '로그인 필요(401)',
      403: '권한 없음(403)',
      404: '찾을 수 없음(404)',
      408: '요청 시간 초과(408)',
    };
    const e = new Error(serverMsg || map[status] || `요청 실패(${status})`);
    e.status = status;
    throw e;
  }
  if (err?.code === 'ECONNABORTED') {
    const e = new Error('요청 시간 초과(408)');
    e.status = 408;
    throw e;
  }
  throw err;
}

/** GET /api/users/{userId}/history/favorites
 * @returns {Promise<Array>} history 배열 반환
 */
export async function getFavorites(userId) {
  try {
    const { data } = await api.get(`/api/users/${userId}/history/favorites`);
    // 서버 응답 형식: { history: [...] }
    return Array.isArray(data?.history) ? data.history : [];
  } catch (err) {
    toReadableError(err);
  }
}

/** POST /api/users/{userId}/history/favorites
 * body: { historyId: number, type: boolean } // true=추가, false=삭제
 */
export async function updateFavorite(userId, { historyId, type }) {
  try {
    const { data } = await api.post(`/api/users/${userId}/history/favorites`, {
      historyId,
      type,
    });
    return data; // { message: "OK" }
  } catch (err) {
    toReadableError(err);
  }
}
