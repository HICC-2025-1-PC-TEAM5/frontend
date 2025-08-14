// src/lib/fridge.js
import api, { apiFetch } from './api'; // <- API_BASE 제거

// 공통 헤더 (apiFetch를 안 쓸 경우용)
function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

// 영수증 이미지 업로드 → 인식된 재료 배열 응답
export async function extractIngredientsFromReceipt(userId, file) {
  const form = new FormData();
  form.append('image', file);
  const res = await api.post(
    `/api/users/${userId}/fridge/recipes-to-ingredients`,
    form // axios가 boundary 포함해서 Content-Type 자동 설정
  );
  return res.data; // 예: [{ name, category }, ...]
}

// 냉장고 재료 조회
export async function getIngredients(userId) {
  const res = await api.get(`/api/users/${userId}/fridge/ingredients`);
  return res.data;
}

// 냉장고 재료 추가
export async function addIngredients(userId, items) {
  const nowISO = new Date().toISOString();

  const normalized = items.map((it) => {
    const expireISO = it.expire
      ? new Date(it.expire).toISOString()
      : it.expire_date
        ? new Date(it.expire_date).toISOString()
        : undefined;

    return {
      name: it.name,
      quantity: it.qty ?? it.quantity ?? 1,
      unit: it.unit || '개',
      type: it.type || '냉장실',
      input_date: it.input_date || nowISO,
      ...(expireISO ? { expire_date: expireISO } : {}),
    };
  });

  const payload = { ingredients: normalized };

  return apiFetch(`/api/users/${userId}/fridge/ingredients`, {
    method: 'POST',
    body: payload, // apiFetch가 JSON.stringify + 헤더 처리해주는 형태라고 가정
  });
}

// 수량 수정 (PATCH)
export async function patchFridgeQuantity({
  userId,
  refrigeratorId,
  quantity,
  token,
}) {
  // apiFetch로 통일
  return apiFetch(
    `/api/users/${userId}/fridge/ingredients/${refrigeratorId}/quantity`,
    {
      method: 'PATCH',
      headers: authHeaders(token),
      body: { quantity },
    }
  );
}

// 재료 상세 조회 (GET)
export async function getIngredientDetail({ userId, ingredientId, token }) {
  return apiFetch(`/api/users/${userId}/fridge/ingredients/${ingredientId}`, {
    method: 'GET',
    headers: authHeaders(token),
  });
}

// 재료 삭제 (DELETE) — 경로/복수형 주의
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

//사진에서 재료 추출하기
export async function extractIngredientsFromImage({
  userId,
  token,
  file,
  timeoutMs = 30000,
}) {
  const url = `/api/users/${userId}/fridge/image-to-ingredients`;

  const form = new FormData();
  form.append('image', file);

  // 타임아웃/취소를 위한 AbortController 인스턴스
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        // FormData 사용 시 Content-Type은 넣지 마세요(브라우저가 boundary 포함해서 설정)
        Authorization: `Bearer ${token}`,
      },
      body: form,
      signal: controller.signal,
    });

    if (!res.ok) {
      // 상태코드 매핑
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
      // 타임아웃/사용자 취소 시
      throw Object.assign(new Error('요청 시간이 초과되었습니다'), {
        code: 408,
      });
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}
