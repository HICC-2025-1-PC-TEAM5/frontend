import { createContext, useContext, useMemo, useState, useEffect } from 'react';

const SavedCtx = createContext(null);

export function SavedRecipesProvider({ children }) {
  const [ids, setIds] = useState(() => {
    try {
      const raw = localStorage.getItem('savedRecipes');
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });
  useEffect(() => {
    localStorage.setItem('savedRecipes', JSON.stringify([...ids]));
  }, [ids]);
  const api = useMemo(
    () => ({
      isSaved: (id) => ids.has(String(id)),
      add: (id) => setIds((prev) => new Set(prev).add(String(id))),
      remove: (id) =>
        setIds((prev) => {
          const next = new Set(prev);
          next.delete(String(id));
          return next;
        }),
      toggle: (id) =>
        setIds((prev) => {
          const next = new Set(prev);
          const key = String(id);
          next.has(key) ? next.delete(key) : next.add(key);
          return next;
        }),
      all: ids,
    }),
    [ids]
  );
  return <SavedCtx.Provider value={api}>{children}</SavedCtx.Provider>;
}

export function useSavedRecipes() {
  const ctx = useContext(SavedCtx);
  if (!ctx)
    throw new Error('useSavedRecipes must be used inside SaveRecipesProvider');
  return ctx;
}
