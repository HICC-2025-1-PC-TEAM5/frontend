import api from './api';
import { useCallback, useEffect, useMemo, useState } from 'react';

export async function getAllergies(userId) {
  const res = await api.get(`/api/users/${userId}/preference/allergy`);
  return res.data?.allergyList ?? [];
}

export async function addAllergy(userId, ingredientId) {
  const res = await api.post(`/api/users/${userId}/preference/allergy`, {
    ingredientId,
  });
  return res.data;
}

export async function removeAllergy(userId, allergyId) {
  const res = await api.delete(
    `/api/users/${userId}/preference/allergy/${allergyId}`
  );
  return res.data;
}
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
      // 낙관적 업데이트 (중복 방지)
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
