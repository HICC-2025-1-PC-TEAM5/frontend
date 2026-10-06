// src/lib/fridge.js
import api, { apiFetch } from './api';

/* ---------------- 공통 ---------------- */
function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

// 내부 → 서버 전송용 보관 위치 매핑
// 서버는 BE StorageCondition 값('실온' | '냉장실' | '냉동고')만 받는다 (D-015, 다른 값은 400)
function serverTypeFromInternal(t) {
  const v = String(t ?? '').trim();
  if (v === 'room' || v === '실온') return '실온';
  if (v === 'freezer' || v === '냉동고' || v === '냉동실') return '냉동고';
  if (v === 'fridge' || v === '냉장실' || v === '냉장고') return '냉장실';
  return '냉장실'; // 보관 위치를 고르지 않은 경우 (사진·영수증 등록 기본값과 같음)
}

/* ---------------- 영수증/이미지 인식 ---------------- */

// [수정] 영수증 → 재료 추출 (경로 변경)
export async function extractIngredientsFromReceipt(userId, file) {
  const form = new FormData();
  form.append('image', file);
  const res = await api.post(
    `/api/users/${userId}/fridge/receipt-to-ingredients`,
    form // axios가 boundary 포함 Content-Type 자동 설정
  );
  // 서버: [{ name, category }, ...]
  return res.data;
}

// 사진에서 재료 추출하기 (일반 이미지)
// 공용 apiFetch 사용: VITE_API_BASE_URL 기준 주소, Bearer 자동 첨부, 401/419 시 refresh 후 재시도,
// 오류는 err.status(타임아웃 408)로 전달 (C6). 인식은 오래 걸릴 수 있어 타임아웃 30초
export async function extractIngredientsFromImage({
  userId,
  file,
  timeoutMs = 30000,
}) {
  const form = new FormData();
  form.append('image', file);
  return apiFetch(`/api/users/${userId}/fridge/image-to-ingredients`, {
    method: 'POST',
    body: form, // FormData면 apiFetch가 Content-Type을 생략한다
    timeout: timeoutMs,
  });
}

/* ---------------- 냉장고 재료 ---------------- */

// 냉장고 재료 조회
export async function getIngredients(userId) {
  const res = await api.get(`/api/users/${userId}/fridge/ingredients`);
  // 서버: { refrigeratorIngredient: [...] }
  return res.data;
}

// [수정] 냉장고 재료 추가 (바디 키 & type 매핑)
export async function addIngredients(userId, items) {
  const nowISO = new Date().toISOString();

  const normalized = items.map((it) => {
    const expireISO = it.expire
      ? new Date(it.expire).toISOString()
      : it.expire_date
        ? new Date(it.expire_date).toISOString()
        : it.expireDate
          ? new Date(it.expireDate).toISOString()
          : undefined;

    return {
      name: it.name,
      quantity: it.qty ?? it.quantity ?? 1,
      unit: it.unit || '개',
      type: serverTypeFromInternal(it.type), // 내부값 → 서버값
      input_date: it.input_date || it.inputDate || nowISO,
      ...(expireISO ? { expire_date: expireISO } : {}),
    };
  });

  // [수정] 서버 스펙: refrigeratorIngredient
  const payload = { refrigeratorIngredient: normalized };

  return apiFetch(`/api/users/${userId}/fridge/ingredients`, {
    method: 'POST',
    body: payload, // apiFetch가 JSON.stringify 처리
  });
}

// 수량 수정 (PATCH) — 서버: PATCH /api/users/{userId}/fridge/ingredients
// body { refrigeratorIngredientId, quantity }. quantity가 0이면 서버가 재료를 삭제한다 (C2, D-016)
export async function patchFridgeQuantity({
  userId,
  refrigeratorId,
  quantity,
  token,
}) {
  return apiFetch(`/api/users/${userId}/fridge/ingredients`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: { refrigeratorIngredientId: refrigeratorId, quantity },
  });
}

// 재료 상세 조회 (GET) - 냉장고 보유 품목 상세
export async function getIngredientDetail({ userId, ingredientId, token }) {
  return apiFetch(`/api/users/${userId}/fridge/ingredients/${ingredientId}`, {
    method: 'GET',
    headers: authHeaders(token),
  });
}

// 재료 삭제 (DELETE)
export async function deleteFridgeIngredient({
  userId,
  refrigeratorId,
  token,
}) {
  return apiFetch(`/api/users/${userId}/fridge/ingredients/${refrigeratorId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
}

/**
 * 냉장고 재료 여러 개를 id로 삭제한다. 일괄 삭제 API가 없어 개별 삭제를 동시에 보낸다 (D-017)
 * 일부가 실패해도 나머지 결과를 돌려준다. 실패를 성공으로 숨기지 않는다
 * @returns {Promise<{ deleted: Array<string|number>, failed: Array<string|number> }>}
 */
export async function deleteFridgeIngredients({ userId, ids = [] }) {
  const results = await Promise.allSettled(
    ids.map((id) => api.delete(`/api/users/${userId}/fridge/ingredients/${id}`))
  );
  const deleted = [];
  const failed = [];
  results.forEach((r, i) =>
    (r.status === 'fulfilled' ? deleted : failed).push(ids[i])
  );
  return { deleted, failed };
}

/**
 * 레시피 재료 문자열(예: "돼지고기 200g")에 이름이 들어 있는 냉장고 재료를 후보로 고른다 (D-017)
 * 후보는 사용자가 확인하고 체크한 것만 삭제한다
 */
export function matchUsedIngredients(recipeTexts = [], fridgeItems = []) {
  const texts = recipeTexts.map((t) => String(t).replace(/\s+/g, ''));
  return fridgeItems.filter((it) => {
    const name = String(it.name || '').replace(/\s+/g, '');
    return name && texts.some((t) => t.includes(name));
  });
}

/* ---------------- 기본 재료 추천(necessary) ---------------- */

// [수정] 호출 버그(.apply) 제거 & 에러 메시지 보강
export async function getNecessaryIngredients(userId) {
  try {
    const res = await api.get(`/api/users/${userId}/fridge/necessary`);
    // 서버: { ingredientList: [...] }
    return res.data?.ingredientList ?? [];
  } catch (err) {
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
    throw err;
  }
}
