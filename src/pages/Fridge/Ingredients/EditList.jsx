// src/pages/Fridge/Ingredients/EditList.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import CategorySelect from '../components/CategorySelect';
import Button from '../../../components/Button';
import styles from './EditList.module.css';
import { getIngredients, deleteFridgeIngredient } from '../../../lib/fridge';

// 보관위치 정규화: '냉장/냉장실' → 'fridge' 등
function normalizeLocation(loc = '') {
  const s = String(loc);
  if (/냉장/.test(s) || /fridge/i.test(s)) return 'fridge';
  if (/냉동/.test(s) || /freez/i.test(s)) return 'freezer';
  if (/실온/.test(s) || /room/i.test(s)) return 'room';
  return 'fridge';
}

// 카테고리 정규화: 서버/인식 결과를 하위 탭 id로 정리
function normalizeCategoryKo(mainCat, raw) {
  const s = String(raw ?? '').trim();
  const table = {
    // 공통
    채소: 'vegetable',
    과일: 'fruit',
    고기: 'meat',
    해산물: 'meat',
    계란: 'dairy',
    유제품: 'dairy',
    양념: 'condiment',
    조미료: 'condiment',
    가공식품: 'processed',
    실온채소: 'roomVeg',
    곡류: 'grain',
    건조식품: 'grain',
    '조미료/향신료': 'spice',
  };

  // 하위 키워드 매칭
  for (const k of Object.keys(table)) {
    if (s.includes(k)) return table[k];
  }
  // 상위 카테고리별 기본값
  if (mainCat === 'room' && s === '') return 'etc';
  return 'etc';
}

export default function EditList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [mainCat, setMainCat] = useState('all');
  const [subCat, setSubCat] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const userId = import.meta.env.VITE_DEV_USER_ID || '1';
        const data = await getIngredients(userId);
        const raw = Array.isArray(data)
          ? data
          : (data?.refrigeratorIngredient ?? []);

        const list = raw.map((it) => {
          const location = normalizeLocation(it.main ?? it.location);
          const imageSrc =
            it.imageUrl ||
            it.image ||
            it.thumbnail ||
            it.thumbnailUrl ||
            `https://picsum.photos/seed/${encodeURIComponent(it.name || it.id)}/600/400`;

          return {
            id: it.id,
            name: it.name,
            imageSrc,
            location,
            category: normalizeCategoryKo(location, it.category),
            expire: it.expire_date?.slice?.(0, 10) || '',
          };
        });
        setItems(list);
      } catch (e) {
        console.error(e);
        alert('재료를 불러오지 못했어요');
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (mainCat !== 'all' && it.location !== mainCat) return false;
      if (subCat !== 'all' && it.category !== subCat) return false;
      return true;
    });
  }, [items, mainCat, subCat]);

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const resetSelection = () => setSelected(new Set());

  const openConfirm = () => {
    if (selected.size > 0) setConfirmOpen(true);
  };
  const closeConfirm = () => setConfirmOpen(false);

  const handleDelete = async () => {
    const ids = Array.from(selected);
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (!userId || !token) throw new Error('로그인이 필요합니다.');

      await Promise.all(
        ids.map((refrigeratorId) =>
          deleteFridgeIngredient({ userId, refrigeratorId, token })
        )
      );

      setItems((prev) => prev.filter((it) => !selected.has(it.id)));
      resetSelection();
      setConfirmOpen(false);
      alert('선택한 재료가 삭제되었어요.');
    } catch (err) {
      console.error(err);
      const s = err.status;
      if (s === 400) alert('잘못된 요청(400)');
      else if (s === 401) alert('로그인이 필요합니다(401)');
      else if (s === 404) alert('대상을 찾을 수 없습니다(404)');
      else if (s === 408) alert('요청 시간 초과(408)');
      else alert(err.message || '알 수 없는 오류');
    }
  };

  return (
    <>
      {/* 상단 헤더 */}
      <div className={styles.header}>
        <Button variant="invisible" icon="only" onClick={() => navigate(-1)}>
          X
        </Button>
        <p className={styles.title}>재료 삭제</p>
        <span className={styles.headerSide} />
      </div>
      <div className={styles.headerSpacer} />

      {/* 카테고리 선택 (컨트롤드) */}
      <div className={styles.categoryWrap}>
        <CategorySelect
          mainSelected={mainCat}
          subSelected={subCat}
          onChangeMain={setMainCat}
          onChangeSub={setSubCat}
        />
      </div>

      {/* 그리드 */}
      <div className={styles.grid}>
        {filtered.map((it) => {
          const isSel = selected.has(it.id);
          return (
            <button
              key={it.id}
              className={`${styles.card} ${isSel ? styles.selected : ''}`}
              onClick={() => toggle(it.id)}
            >
              <div className={styles.thumbWrap}>
                <img className={styles.thumb} src={it.imageSrc} alt={it.name} />
                {isSel && <span className={styles.dim} aria-hidden />}
              </div>
              <div className={styles.meta}>
                <p className={styles.name}>{it.name}</p>
                <p className={styles.desc}>{it.expire ? `${it.expire}` : ''}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 액션바 */}
      {selected.size > 0 && (
        <div className={styles.actionBar}>
          <button className={styles.resetBtn} onClick={resetSelection}>
            초기화
          </button>
          <div className={styles.count}>{selected.size}개 선택</div>
          <Button variant="primary" border="round" onClick={openConfirm}>
            삭제
          </Button>
        </div>
      )}

      {/* 확인 시트 */}
      {confirmOpen && (
        <div
          className={styles.backdrop}
          onClick={(e) => e.target === e.currentTarget && closeConfirm()}
        >
          <section className={styles.sheet}>
            <div className={styles.grip} />
            <p className={styles.confirmText}>
              선택된 <b>{selected.size}</b>개의 재료를 정말 삭제하실건가요?
            </p>
            <div className={styles.sheetButtons}>
              <Button variant="outlined" onClick={closeConfirm}>
                취소
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                삭제
              </Button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
