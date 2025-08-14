import { useEffect, useRef, useState } from 'react';
import Button from '../../../components/Button';
import DateInput from '../../../components/DateInput';
import OptionsInput from '../../../components/OptionsInput';
import PeopleCounter from '../../Recipes/components/PeopleCounter';
import styles from './EditSheet.module.css';

export default function EditSheet({
  open = false,
  initial = {
    expire: '',
    location: '냉장실',
    quantity: 1,
    unit: '개',
  },
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(initial);
  const sheetRef = useRef(null);

  // ✅ 무한 루프 방지: open이 true일 때만 초기값 세팅
  useEffect(() => {
    if (open) {
      setForm(initial);
    }
  }, [open]);

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget && onClose) onClose();
  };

  // 모바일 시트 드래그 닫기
  const startY = useRef(0);
  const offsetY = useRef(0);

  const onTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    sheetRef.current.style.transition = 'none';
  };

  const onTouchMove = (e) => {
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) {
      offsetY.current = dy;
      sheetRef.current.style.transform = `translateY(${dy}px)`;
    }
  };

  const onTouchEnd = () => {
    sheetRef.current.style.transition = '';
    if (offsetY.current > 120) {
      onClose && onClose();
    } else {
      sheetRef.current.style.transform = '';
    }
    offsetY.current = 0;
  };

  const setValue = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({ expire: '', location: '냉장실', quantity: 1, unit: '개' });
  };

  const submit = () => {
    onSubmit && onSubmit(form);
  };

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
        <h2 className={styles.title}>재료 정보 수정</h2>

        <div className={styles.formGrid}>
          {/* 소비기한 */}
          <div className={styles.field}>
            <label className={styles.label}>소비기한</label>
            <DateInput
              value={form.expire}
              onChange={(v) => setValue('expire', v)}
              placeholder="2025.00.00"
            />
          </div>

          {/* 보관위치 */}
          <div className={styles.field}>
            <label className={styles.label}>보관위치</label>
            <OptionsInput
              value={form.location}
              onChange={(e) => setValue('location', e.target?.value ?? e)}
            >
              <option value="냉장실">냉장실</option>
              <option value="냉동실">냉동실</option>
              <option value="실온">실온</option>
            </OptionsInput>
          </div>

          {/* 수량 */}
          <div className={styles.field}>
            <label className={styles.label}>수량</label>
            <div className={styles.stepperWrap}>
              <PeopleCounter
                min={0}
                initial={form.quantity}
                onChange={(n) => setValue('quantity', n)}
              />
            </div>
          </div>

          {/* 단위 */}
          <div className={styles.field}>
            <label className={styles.label}>단위</label>
            <OptionsInput
              value={form.unit}
              onChange={(e) => setValue('unit', e.target?.value ?? e)}
            >
              <option value="개">개</option>
              <option value="g">g</option>
              <option value="ml">ml</option>
              <option value="팩">팩</option>
            </OptionsInput>
          </div>
        </div>

        <div className={styles.footer}>
          <Button variant="outlined" size="small" onClick={resetForm}>
            초기화
          </Button>
          <Button variant="primary" size="small" onClick={submit}>
            완료
          </Button>
        </div>
      </section>
    </div>
  );
}
