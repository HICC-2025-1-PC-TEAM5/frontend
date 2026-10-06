// 조리 완료 시 다 쓴 냉장고 재료를 사용자가 체크해 삭제한다 (D-017)
// 후보(레시피에 나오는 재료)를 먼저 보여 주고, 필요하면 냉장고 전체를 펼쳐 더 고른다. 기본은 체크 안 됨
import { useState } from 'react';
import Button from '../../../components/Button';
import styles from './UsedIngredientsSheet.module.css';

function CheckRow({ item, checked, onToggle }) {
  return (
    <label className={styles.row}>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(item.id)}
      />
      <span className={styles.name}>{item.name}</span>
      <span className={styles.qty}>
        {item.quantity}
        {item.unit}
      </span>
    </label>
  );
}

export default function UsedIngredientsSheet({
  candidates = [],
  others = [],
  saving = false,
  error = '',
  onClose,
  onSubmit,
}) {
  const [checked, setChecked] = useState(() => new Set());
  const [showAll, setShowAll] = useState(candidates.length === 0);

  const toggle = (id) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const isEmpty = candidates.length === 0 && others.length === 0;
  // 이미 삭제돼 목록에서 빠진 재료는 다시 보내지 않는다
  const visibleIds = new Set([...candidates, ...others].map((it) => it.id));
  const selectedIds = Array.from(checked).filter((id) => visibleIds.has(id));

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <section
        className={styles.sheet}
        role="dialog"
        aria-label="다 쓴 재료 선택"
      >
        <div className={styles.grip} />
        <p className={styles.title}>다 쓴 재료를 골라 주세요</p>
        <p className={styles.hint}>체크한 재료는 냉장고에서 삭제돼요</p>

        <div className={styles.list}>
          {isEmpty && <p className={styles.empty}>냉장고에 재료가 없어요</p>}

          {candidates.length > 0 && (
            <>
              <h4 className={styles.group}>이 레시피에 쓰인 재료</h4>
              {candidates.map((it) => (
                <CheckRow
                  key={it.id}
                  item={it}
                  checked={checked.has(it.id)}
                  onToggle={toggle}
                />
              ))}
            </>
          )}

          {others.length > 0 &&
            (showAll ? (
              <>
                <h4 className={styles.group}>냉장고의 다른 재료</h4>
                {others.map((it) => (
                  <CheckRow
                    key={it.id}
                    item={it}
                    checked={checked.has(it.id)}
                    onToggle={toggle}
                  />
                ))}
              </>
            ) : (
              <button
                type="button"
                className={styles.more}
                onClick={() => setShowAll(true)}
              >
                다른 재료도 썼어요 ({others.length})
              </button>
            ))}
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <div className={styles.buttons}>
          <Button variant="outlined" onClick={onClose} disabled={saving}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={() => onSubmit(selectedIds)}
            disabled={saving}
          >
            {saving
              ? '처리 중…'
              : selectedIds.length > 0
                ? `${selectedIds.length}개 삭제하고 완료`
                : '삭제 없이 완료'}
          </Button>
        </div>
      </section>
    </div>
  );
}
