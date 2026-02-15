// src/lib/fridge.js
import api, { apiFetch } from './api';

const API = 'http://localhost:8080';
/* ---------------- 공통 ---------------- */
function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

// 내부 → 서버 전송용 보관 위치 매핑
function serverTypeFromInternal(t) {
  const v = String(t ?? '').trim();
  // 내부 영문 코드 지원
  if (v === 'room') return '실온';
  if (v === 'fridge' || v === '냉장실') return '냉장고';
  if (v === 'freezer') return '냉동고';
  // 이미 한글일 수 있음
  if (v === '실온' || v === '냉장고' || v === '냉동고') return v;
  return '실온';
}

/* ---------------- 영수증/이미지 인식 ---------------- */

// [수정] 영수증 → 재료 추출 (경로 변경)
export async function extractIngredientsFromReceipt(userId, file) {
  const form = new FormData();
  form.append('image', file);
  const res = await api.post(
    `${API}/api/users/${userId}/fridge/receipt-to-ingredients`,
    form // axios가 boundary 포함 Content-Type 자동 설정
  );
  // 서버: [{ name, category }, ...]
  return res.data;
}

// (유지) 사진에서 재료 추출하기 (일반 이미지)
export async function extractIngredientsFromImage({
  userId,
  token,
  file,
  timeoutMs = 30000,
}) {
  const url = `${API}/api/users/${userId}/fridge/image-to-ingredients`;
  const form = new FormData();
  form.append('image', file);

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }, // FormData일 땐 Content-Type 설정 금지
      body: form,
      signal: controller.signal,
    });
    if (!res.ok) {
      switch (res.status) {
        case 400:
          throw Object.assign(new Error('잘못된 요청입니다'), { code: 400 });
        case 404:
          throw Object.assign(new Error('요청한 리소스를 찾을 수 없습니다'), {
            code: 404,
          });
        case 408:
          throw Object.assign(new Error('요청 시간이 초과되었습니다'), {
            code: 408,
          });
        default:
          throw Object.assign(new Error('서버 오류가 발생했습니다'), {
            code: res.status,
          });
      }
    }
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw Object.assign(new Error('요청 시간이 초과되었습니다'), {
        code: 408,
      });
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}

/* ---------------- 냉장고 재료 ---------------- */

// 냉장고 재료 조회
export async function getIngredients(userId) {
  const res = await api.get(`${API}/api/users/${userId}/fridge/ingredients`);
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

// 수량 수정 (PATCH)
export async function patchFridgeQuantity({
  userId,
  refrigeratorId,
  quantity,
  token,
}) {
  return apiFetch(
    `/api/users/${userId}/fridge/ingredients/${refrigeratorId}/quantity`,
    {
      method: 'PATCH',
      headers: authHeaders(token),
      body: { quantity },
    }
  );
}

// 재료 상세 조회 (GET) - 냉장고 보유 품목 상세
export async function getIngredientDetail({ userId, refrigeratorId, token }) {
  return apiFetch(`/api/users/${userId}/fridge/ingredients/${refrigeratorId}`, {
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

export async function removeIngredient(userId, ingredientId) {
  const res = await api.delete(
    `/api/users/${userId}/fridge/ingredients/${ingredientId}`
  );
  return res.data;
}

export async function removeIngredientsByNames(userId, ingredientId, names = []) {
  const clean = names.map((n) => String(n).trim()).filter(Boolean);
  if (!clean.length) return { ok: true, deleted: [] };

  // 1) 서버가 배치 삭제를 지원하면 우선 사용
  try {
    

    const res = await api.delete(
      `/api/users/${userId}/fridge/ingredients/${ingredientId}`,
      { data: { names: clean } }
    );
    return res.data; // { ok, deleted: [...] } 가정
  } catch (err) {
    const st = err?.response?.status;
    if (st && st !== 404 && st !== 405) throw err;
  }

  // 2) 대체: 목록 조회 → 이름 매칭 → 개별 삭제
  const data = await getIngredients(userId);
  const raw = Array.isArray(data) ? data : (data?.refrigeratorIngredient ?? []);
  const set = new Set(clean.map((s) => s.toLowerCase()));
  const targets = raw.filter((it) =>
    set.has(String(it.name || '').toLowerCase())
  );

  await Promise.allSettled(targets.map((t) => removeIngredient(userId, t.id)));
  return { ok: true, deleted: targets.map((t) => t.name) };
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
