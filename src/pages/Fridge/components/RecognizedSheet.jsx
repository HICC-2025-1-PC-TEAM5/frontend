import { useEffect, useRef, useState } from 'react';
import Button from '../../../components/Button';
import styles from './RecognizedSheet.module.css';

export default function RecognizedSheet({
  open = false,
  items = [],
  onClose,
  onComplete,
}) {
  // ✅ 모든 Hook은 컴포넌트 최상단
  const sheetRef = useRef(null);
  const [list, setList] = useState(items);

  // ✅ open 상태가 true이고 items가 바뀌면 동기화
  useEffect(() => {
    if (open) setList(items);
  }, [open, items]);

  // ✅ 시트 닫기
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  // ✅ 수량·이름·단위·기한 수정
  const update = (id, patch) =>
    setList((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it))
    );

  const remove = (id) => setList((prev) => prev.filter((it) => it.id !== id));

  // ✅ 드래그로 닫기
  const startY = useRef(0);
  const offsetY = useRef(0);

  const onTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    if (sheetRef.current) sheetRef.current.style.transition = 'none';
  };

  const onTouchMove = (e) => {
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0 && sheetRef.current) {
      offsetY.current = dy;
      sheetRef.current.style.transform = `translateY(${dy}px)`;
    }
  };

  const onTouchEnd = () => {
    if (!sheetRef.current) return;
    sheetRef.current.style.transition = '';
    if (offsetY.current > 120) {
      onClose?.();
    } else {
      sheetRef.current.style.transform = '';
    }
    offsetY.current = 0;
  };

  // ✅ 렌더링
  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={handleBackdrop}>
      <section
        ref={sheetRef}
        className={styles.sheet}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className={styles.grip} />
        <div className={styles.sheetHeader}>
          <h3>재료 등록 목록</h3>
          <Button size="small" variant="outlined" onClick={() => setList([])}>
            초기화
          </Button>
        </div>

        <ul className={styles.list}>
          {list.map((it) => (
            <li key={it.id} className={styles.item}>
              <img className={styles.thumb} src={it.thumb} alt={it.name} />
              <div className={styles.row}>
                <input
                  className={styles.nameInput}
                  value={it.name}
                  onChange={(e) => update(it.id, { name: e.target.value })}
                />
                <button
                  className={styles.deleteBtn}
                  onClick={() => remove(it.id)}
                >
                  삭제
                </button>
              </div>

              <div className={styles.row}>
                <div className={styles.qtyBox}>
                  <button
                    onClick={() =>
                      update(it.id, { qty: Math.max(0, (it.qty || 0) - 1) })
                    }
                  >
                    -
                  </button>
                  <span>{it.qty}</span>
                  <button
                    onClick={() => update(it.id, { qty: (it.qty || 0) + 1 })}
                  >
                    +
                  </button>

                  <select
                    className={styles.unit}
                    value={it.unit}
                    onChange={(e) => update(it.id, { unit: e.target.value })}
                  >
                    <option value="개">개</option>
                    <option value="팩">팩</option>
                    <option value="g">g</option>
                  </select>
                </div>

                <input
                  className={styles.date}
                  placeholder="2000.00.00"
                  value={it.expire || ''}
                  onChange={(e) => update(it.id, { expire: e.target.value })}
                />
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.footer}>
          <Button variant="outlined" onClick={onClose}>
            닫기
          </Button>
          <Button variant="primary" onClick={() => onComplete?.(list)}>
            완료
          </Button>
        </div>
      </section>
    </div>
  );
}
