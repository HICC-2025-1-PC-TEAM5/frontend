import api from './api';
import { useCallback, useEffect, useMemo, useState } from 'react';
const API = 'http://localhost:8080';
/* ---------------- 공통 에러 ---------------- */
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

/* -------------- (서버) 레시피 기반 고정 취향 -------------- */
/* 서버 명세가 있는 경우 유지(선택). 지금은 재료 중심으로 쓰지 않으면 생략 가능 */
export async function getPreferences(userId) {
  try {
    const { data } = await api.get(`${API}/api/users/${userId}/preference`);
    return data; // { like: [...], dislike: [...] }
  } catch (err) {
    toReadableError(err);
  }
}

export async function addPreference(userId, { recipeId, type }) {
  try {
    // ✅ GET → POST로 수정
    const { data } = await api.post(`${API}/api/users/${userId}/preference`, {
      recipeId,
      type, // "좋아요" | "싫어요"
    });
    return data; // { message: "OK" }
  } catch (err) {
    toReadableError(err);
  }
}

export async function deletePreference(userId, id) {
  try {
    const { data } = await api.delete(`${API}/api/users/${userId}/preference`, {
      data: { id }, // axios.delete body는 config.data로
    });
    return data; // { message: "OK" }
  } catch (err) {
    toReadableError(err);
  }
}

/* ---------------- (서버) 알레르기 ---------------- */
export async function getAllergies(userId) {
  try {
    const res = await api.get(`${API}/api/users/${userId}/preference/allergy`);
    return res.data?.allergyList ?? [];
  } catch (err) {
    toReadableError(err);
  }
}

export async function addAllergy(userId, ingredientId) {
  try {
    const res = await api.post(`${API}/api/users/${userId}/preference/allergy`, {
      ingredientId,
    });
    return res.data;
  } catch (err) {
    toReadableError(err);
  }
}

export async function removeAllergy(userId, allergyId) {
  try {
    const res = await api.delete(
      `${API}/api/users/${userId}/preference/allergy/${allergyId}`
    );
    return res.data;
  } catch (err) {
    toReadableError(err);
  }
}

/* ---------------- 알레르기 훅 ---------------- */
export function useAllergies(userId) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setErr(null);
      const data = await getAllergies(userId);
      setList(data);
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) refetch();
  }, [userId, refetch]);

  const add = useCallback(
    async (ingredientId) => {
      try {
        await addAllergy(userId, ingredientId);
        await refetch();
      } catch (e) {
        setErr(e);
        throw e;
      }
    },
    [userId, refetch]
  );

  const remove = useCallback(
    async (allergyId) => {
      try {
        await removeAllergy(userId, allergyId);
        setList((prev) => prev.filter((a) => a.allergyId !== allergyId));
      } catch (e) {
        setErr(e);
        throw e;
      }
    },
    [userId]
  );

  return useMemo(
    () => ({ list, loading, error: err, refetch, add, remove }),
    [list, loading, err, refetch, add, remove]
  );
}

/* --------- (클라 로컬) 재료 기반 좋아요/싫어요 --------- */
const KEY = 'ingredientPrefs';
const norm = (arr) =>
  Array.from(
    new Set(
      (arr || [])
        .map(String)
        .map((s) => s.trim())
        .filter(Boolean)
    )
  );

export function getIngredientPrefs() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY)) || {};
    return {
      likeIngredients: norm(raw.likeIngredients),
      dislikeIngredients: norm(raw.dislikeIngredients),
    };
  } catch {
    return { likeIngredients: [], dislikeIngredients: [] };
  }
}

export function saveIngredientPrefs({ likeIngredients, dislikeIngredients }) {
  localStorage.setItem(
    KEY,
    JSON.stringify({
      likeIngredients: norm(likeIngredients),
      dislikeIngredients: norm(dislikeIngredients),
    })
  );
}

/* ---- 서버 추천 호출용 파라미터 빌더 (핵심) ---- */
/** 서버에 보낼 추천 파라미터 구성
 * @returns {{ likeIngredients: string, excludeIngredients: string }}
 */
export async function buildRecommendParams(userId) {
  const { likeIngredients, dislikeIngredients } = getIngredientPrefs();
  const allergies = await getAllergies(userId); // [{allergyId, name}]
  const allergyNames = (allergies || []).map((a) => a.name);

  return {
    likeIngredients: likeIngredients.join(','), // ex) "감자,버섯"
    excludeIngredients: [...dislikeIngredients, ...allergyNames].join(','), // ex) "오이,파래,땅콩"
  };
}
