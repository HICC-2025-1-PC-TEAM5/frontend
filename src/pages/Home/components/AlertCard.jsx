import styles from './AlertCard.module.css';
import Button from '../../../components/Button';

export default function AlertCard({ onClick }) {
  return (
    <div className={styles.card}>
      <p className={styles.message}> 냉장고에 임박한 재료가 있어요</p>
      <div className={styles.actionArea}>
        <span className={styles.linkText}>바로가기</span>
        <Button
          variant="default"
          size="large" // 크기 키우기용 (size_ 속성)
          border="round" // border-radius 값 적용
          className={styles.customButton}
          icon="only"
          onClick={onClick}
        ></Button>
      </div>
    </div>
  );
}
