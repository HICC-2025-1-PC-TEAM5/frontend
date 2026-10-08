// src/pages/Recipes/SavedRecipesContext.jsx
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import api from '../../lib/api';
import { useUser } from '../UserContext';
import { readUserItem, writeUserItem } from '../../lib/userStorage';

// 서버 응답 예시:
// GET /api/users/{userId}/history/favorites
// { history: [{ id:1, recipeId:3, name, image, ... }, ...] }
//
// POST /api/users/{userId}/history/favorites
// body: { historyId: number, type: boolean } // true=즐겨찾기 추가, false=삭제

const SavedCtx = createContext(null);
const LS_KEY = 'savedRecipes'; // recipeId 캐시(Set). 계정별 키 savedRecipes:{userId} (D-036)

function readLocalSet(userId) {
  const arr = readUserItem(LS_KEY, userId);
  return new Set((Array.isArray(arr) ? arr : []).map(String));
}

export function SavedRecipesProvider({ children }) {
  const { id: userId, isAuthed } = useUser();

  // 서버에서 내려오는 history 목록 (인증 시)
  const [history, setHistory] = useState([]); // [{id:historyId, recipeId, ...}]
  const [loading, setLoading] = useState(!!isAuthed);

  // 로컬 recipeId Set (UI 즉시 반응 & fallback). 어느 계정의 캐시인지 owner로 함께 들고 있어
  // 계정이 바뀐 직후 이전 계정 값을 새 계정 키에 쓰지 않게 한다
  const owner = userId || null;
  const [local, setLocal] = useState(() => ({
    owner,
    ids: readLocalSet(owner),
  }));
  if (local.owner !== owner) {
    setLocal({ owner, ids: readLocalSet(owner) });
  }
  const localIds = local.ids;
  const setLocalIds = useCallback(
    (updater) =>
      setLocal((prev) => ({
        owner: prev.owner,
        ids: typeof updater === 'function' ? updater(prev.ids) : updater,
      })),
    []
  );

  useEffect(() => {
    writeUserItem(LS_KEY, local.owner, [...local.ids]);
  }, [local]);

  // 인증되어 있으면 최초 동기화
  const refetch = useCallback(async () => {
    if (!isAuthed || !userId) {
      setHistory([]); // 로그아웃·계정 변경 시 이전 계정 기록을 남기지 않는다
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get(`/api/users/${userId}/history/favorites`);
      const list = Array.isArray(data?.history) ? data.history : [];
      setHistory(list);

      // 서버 기준으로 로컬 recipeId 캐시도 맞춰둠(UX 일관)
      const serverRecipeIds = new Set(list.map((h) => String(h.recipeId)));
      // 응답이 오는 사이 계정이 바뀌었으면 새 계정 캐시에 쓰지 않는다
      setLocal((prev) =>
        prev.owner === userId
          ? { owner: prev.owner, ids: serverRecipeIds }
          : prev
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthed, userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // 빠른 조회용 인덱스
  const byRecipeId = useMemo(
    () => new Map(history.map((h) => [String(h.recipeId), h])),
    [history]
  );
  const byHistoryId = useMemo(
    () => new Map(history.map((h) => [String(h.id), h])),
    [history]
  );

  /* =============== 공개 API (기존 시그니처 최대한 유지) =============== */

  // id는 'recipeId' 기준으로 동작 (기존 로컬 버전 호환)
  const isSaved = useCallback((id) => localIds.has(String(id)), [localIds]);

  // add/remove/toggle은 가능한 경우 서버까지 반영
  const add = useCallback(
    async (recipeId) => {
      const key = String(recipeId);
      // UI 즉시 반응
      setLocalIds((prev) => new Set(prev).add(key));

      if (!isAuthed || !userId) return { ok: true, offline: true };

      // 서버는 historyId가 필요 → 매칭되는 history가 없으면 서버에 바로 추가 불가
      const hit = byRecipeId.get(key);
      if (!hit) {
        console.warn(
          '[Favorites] 해당 recipeId에 대한 historyId가 없어 서버에 즉시 추가할 수 없습니다. ' +
            '레시피 상세 등에서 히스토리를 생성한 뒤 다시 시도하세요.'
        );
        return { ok: true, offline: true, reason: 'NO_HISTORY_ID' };
      }

      await api.post(`/api/users/${userId}/history/favorites`, {
        historyId: hit.id,
        type: true,
      });
      // 서버 동기화
      await refetch();
      return { ok: true };
    },
    [isAuthed, userId, byRecipeId, refetch, setLocalIds]
  );

  const remove = useCallback(
    async (recipeId) => {
      const key = String(recipeId);
      // UI 즉시 반응
      setLocalIds((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });

      if (!isAuthed || !userId) return { ok: true, offline: true };

      const hit = byRecipeId.get(key);
      if (!hit) {
        // 서버에 반영할 historyId 없음 → 로컬만 제거
        console.warn(
          '[Favorites] 서버에 반영할 historyId가 없어 로컬 캐시만 제거했습니다.'
        );
        return { ok: true, offline: true, reason: 'NO_HISTORY_ID' };
      }

      await api.post(`/api/users/${userId}/history/favorites`, {
        historyId: hit.id,
        type: false,
      });
      await refetch();
      return { ok: true };
    },
    [isAuthed, userId, byRecipeId, refetch, setLocalIds]
  );

  const toggle = useCallback(
    async (recipeId) => {
      if (isSaved(recipeId)) {
        return remove(recipeId);
      }
      return add(recipeId);
    },
    [isSaved, add, remove]
  );

  // 히스토리 ID를 이미 알고 있는 화면(프로필/히스토리 목록)용 헬퍼들
  const isSavedByHistory = useCallback(
    (historyId) => {
      const h = byHistoryId.get(String(historyId));
      return h ? localIds.has(String(h.recipeId)) : false;
    },
    [byHistoryId, localIds]
  );

  const toggleByHistory = useCallback(
    async (historyId) => {
      const hid = String(historyId);
      const h = byHistoryId.get(hid);
      if (!h) return { ok: false, reason: 'NOT_FOUND' };

      // 로컬 즉시 토글
      const rid = String(h.recipeId);
      setLocalIds((prev) => {
        const next = new Set(prev);
        next.has(rid) ? next.delete(rid) : next.add(rid);
        return next;
      });

      if (!isAuthed || !userId) return { ok: true, offline: true };

      const nowSaved = isSaved(rid);
      // nowSaved는 토글 이전 상태라 살짝 헷갈릴 수 있음 → 서버엔 반대 값 전송
      await api.post(`/api/users/${userId}/history/favorites`, {
        historyId,
        type: !nowSaved, // true=추가, false=삭제
      });
      await refetch();
      return { ok: true };
    },
    [byHistoryId, isAuthed, userId, isSaved, refetch, setLocalIds]
  );

  const apiValue = useMemo(
    () => ({
      loading,
      // 조회
      isSaved, // recipeId 기준
      isSavedByHistory, // historyId 기준
      // 조작 (recipeId 기준: 기존 시그니처 호환)
      add,
      remove,
      toggle,
      // 조작 (historyId 기준: 히스토리/프로필 화면에서 사용)
      toggleByHistory,
      // 데이터
      all: localIds, // Set<recipeId>
      historyList: history, // [{ id:historyId, recipeId, ... }]
      refetch,
    }),
    [
      loading,
      isSaved,
      isSavedByHistory,
      add,
      remove,
      toggle,
      toggleByHistory,
      localIds,
      history,
      refetch,
    ]
  );

  return <SavedCtx.Provider value={apiValue}>{children}</SavedCtx.Provider>;
}

export function useSavedRecipes() {
  const ctx = useContext(SavedCtx);
  if (!ctx)
    throw new Error('useSavedRecipes must be used inside SavedRecipesProvider');
  return ctx;
}
