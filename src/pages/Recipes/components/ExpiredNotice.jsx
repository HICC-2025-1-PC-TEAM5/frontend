import styles from './ExpiredNotice.module.css';

// 소비기한이 지난 냉장고 재료가 레시피에 쓰일 때 확인 안내 (레시피 계획 Phase 6, D-019)
// 상했는지는 서비스가 판단하지 않고, 오래 보관했으니 확인해 보라고만 알린다
export default function ExpiredNotice({ names, compact = false }) {
  if (!Array.isArray(names) || names.length === 0) return null;
  const list = names.join(', ');

  return (
    <p className={compact ? `${styles.notice} ${styles.compact}` : styles.notice} role="note">
      {compact
        ? `보관한 지 오래된 재료가 있어요 (${list})`
        : `보관한 지 오래된 재료(${list})가 있어요. 상태를 한번 확인해 보세요.`}
    </p>
  );
}
