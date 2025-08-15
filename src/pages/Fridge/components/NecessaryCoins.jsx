import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { getIngredients, getNecessaryIngredients } from '../../../lib/fridge';
import { useUser } from '../../UserContext';
import styles from './NecessaryCoins.module.css';

function normalizeName(v) {
  return String(v || '')
    .trim()
    .toLowerCase();
}

export default function NecessaryCoins() {
  const { id: userId } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]); // 추천 중 "내 냉장고에 없는" 것들만

  useEffect(() => {
    if (!userId) return;
    (async () => {
      setLoading(true);
      try {
        // 1) 현재 냉장고 보유 재료 이름 세트화
        const inv = await getIngredients(userId);
        const raw = Array.isArray(inv)
          ? inv
          : (inv?.refrigeratorIngredient ?? []);
        const owned = new Set(raw.map((it) => normalizeName(it.name)));

        // 2) 필수 재료 추천 불러오기
        const necessary = await getNecessaryIngredients(userId); // [{id,name,imageUrl,category,allergy}]
        // 3) "없는 재료"만 필터
        const missing = necessary.filter(
          (n) => !owned.has(normalizeName(n.name))
        );

        setList(missing);
      } catch (e) {
        console.warn('[NecessaryCoins] failed:', e);
        setList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  if (loading || !list.length) return null;

  const top = useMemo(() => list.slice(0, 8), [list]); // 코인 8개까지만

  const goAddFormPrefilled = (name) => {
    // 재료 추가 페이지로 이동 + 이름 프리필 (라우팅 규칙에 맞게 조정)
    navigate('/fridge/add/form', { state: { presetName: name } });
  };

  return (
    <section className={styles.wrap} aria-label="기본 재료 추천">
      <h3 className={styles.title}>이 재료는 사는 게 어떤가요?</h3>
      <div className={styles.row}>
        {top.map((it) => (
          <button
            key={it.id}
            type="button"
            className={styles.coin}
            onClick={() => goAddFormPrefilled(it.name)}
            aria-label={`${it.name} 추가하러 가기`}
            title={it.allergy ? '알레르기 주의' : it.category || ''}
          >
            <div
              className={`${styles.circle} ${it.allergy ? styles.warn : ''}`}
            >
              {it.imageUrl ? (
                <img src={it.imageUrl} alt={it.name} />
              ) : (
                <span className={styles.fallback} aria-hidden>
                  +
                </span>
              )}
            </div>
            <span className={styles.label}>{it.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
