import styles from './SubstituteNotice.module.css';

// 레시피 재료가 냉장고에 없어도 대신 쓸 수 있는 냉장고 재료가 있을 때 안내 (D-040)
// items: [{ ingredient: '닭고기살', from: '닭고기' }]
export default function SubstituteNotice({ items, compact = false }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  if (compact) {
    const list = items.map((s) => `${s.ingredient} → ${s.from}`).join(', ');
    return (
      <p className={`${styles.notice} ${styles.compact}`} role="note">
        대신 쓸 수 있어요 ({list})
      </p>
    );
  }

  return (
    <p className={styles.notice} role="note">
      {items
        .map(
          (s) =>
            `${s.ingredient}은(는) 냉장고의 ${s.from}(으)로 대신할 수 있어요.`
        )
        .join(' ')}
    </p>
  );
}
