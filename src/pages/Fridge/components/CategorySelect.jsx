import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './CategorySelect.module.css';

/** 상위 카테고리 */
const mainCategories = [
  { id: 'all', label: '전체' },
  { id: 'fridge', label: '냉장고' },
  { id: 'freezer', label: '냉동실' },
  { id: 'room', label: '실온' },
];

/** 하위 카테고리 */
const subCategoriesMap = {
  all: [{ id: 'all', label: '전체' }],
  fridge: [
    { id: 'all', label: '전체' },
    { id: 'vegetable', label: '채소' },
    { id: 'fruit', label: '과일' },
    { id: 'meat', label: '고기/해산물' },
    { id: 'dairy', label: '계란/유제품' },
    { id: 'condiment', label: '양념/조미료' },
    { id: 'etc', label: '기타' },
  ],
  freezer: [
    { id: 'all', label: '전체' },
    { id: 'vegetable', label: '채소' },
    { id: 'fruit', label: '과일' },
    { id: 'meat', label: '고기/해산물' },
    { id: 'processed', label: '가공식품' },
    { id: 'etc', label: '기타' },
  ],
  room: [
    { id: 'all', label: '전체' },
    { id: 'room-veg', label: '실온채소' },
    { id: 'grain-dried', label: '곡류/건조식품' },
    { id: 'cond-spice', label: '조미료/향신료' },
    { id: 'processed', label: '가공식품' },
    { id: 'etc', label: '기타' },
  ],
};

export default function CategorySelect({
  mainSelected: mainFromParent,
  subSelected: subFromParent,
  onChangeMain,
  onChangeSub,
  className = '',
}) {
  const controlledMain = mainFromParent !== undefined;
  const controlledSub = subFromParent !== undefined;

  const [internalMain, setInternalMain] = useState(mainFromParent ?? 'all');
  const [internalSub, setInternalSub] = useState(subFromParent ?? 'all');

  useEffect(() => {
    if (controlledMain) setInternalMain(mainFromParent);
  }, [controlledMain, mainFromParent]);
  useEffect(() => {
    if (controlledSub) setInternalSub(subFromParent);
  }, [controlledSub, subFromParent]);

  const mainSelected = controlledMain ? mainFromParent : internalMain;
  const subSelected = controlledSub ? subFromParent : internalSub;

  const subs = useMemo(
    () => subCategoriesMap[mainSelected] ?? subCategoriesMap.all,
    [mainSelected]
  );

  const selectMain = (id) => {
    if (!controlledMain) setInternalMain(id);
    if (!controlledSub) setInternalSub('all');
    onChangeMain?.(id);
    onChangeSub?.('all');
  };
  const selectSub = (id) => {
    if (!controlledSub) setInternalSub(id);
    onChangeSub?.(id);
  };

  /* =========================
     드래그로 가로 스크롤 (모바일/데스크톱)
     ========================= */
  const mainRef = useRef(null);
  const subRef = useRef(null);

  useEffect(() => {
    const enableDragScroll = (el) => {
      if (!el) return;
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      const onDown = (e) => {
        isDown = true;
        startX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
        scrollLeft = el.scrollLeft;
        el.classList.add(styles.grabbing);
      };
      const onMove = (e) => {
        if (!isDown) return;
        const x = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
        const dx = x - startX;
        el.scrollLeft = scrollLeft - dx;
      };
      const onUp = () => {
        isDown = false;
        el.classList.remove(styles.grabbing);
      };

      // 포인터/마우스/터치 이벤트 등록
      el.addEventListener('pointerdown', onDown, { passive: true });
      el.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerup', onUp, { passive: true });

      // 터치 지원
      el.addEventListener('touchstart', onDown, { passive: true });
      el.addEventListener('touchmove', onMove, { passive: true });
      window.addEventListener('touchend', onUp, { passive: true });

      return () => {
        el.removeEventListener('pointerdown', onDown);
        el.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        el.removeEventListener('touchstart', onDown);
        el.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onUp);
      };
    };

    const cleanMain = enableDragScroll(mainRef.current);
    const cleanSub = enableDragScroll(subRef.current);
    return () => {
      cleanMain && cleanMain();
      cleanSub && cleanSub();
    };
  }, []);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {/* 상위 탭: 가로 스크롤 가능 */}
      <div
        ref={mainRef}
        className={`${styles.segmentedControl} ${styles.scrollDrag}`}
      >
        {mainCategories.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`${styles.tabButton} ${mainSelected === id ? styles.active : ''}`}
            onClick={() => selectMain(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 하위 탭: 가로 스크롤 가능 */}
      <div ref={subRef} className={`${styles.subControl} ${styles.scrollDrag}`}>
        {subs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`${styles.tabButton} ${subSelected === id ? styles.active : ''}`}
            onClick={() => selectSub(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export { mainCategories, subCategoriesMap };
