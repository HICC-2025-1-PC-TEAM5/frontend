import styles from './PreferenceInfo.module.css';
import Button from '../../../components/Button';

export default function PreferenceInfo() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>요리 취향 정보</h2>
      <p className={styles.description}>
        입맛에 딱 맞는 요리를 추천받을 수 있어요.
      </p>

      <div className={styles.section}>
        <span className={styles.label}>좋아요</span>
        <div className={styles.buttonGroup}>
          <Button variant="default">한식</Button>
          <Button variant="default">한식</Button>
        </div>
      </div>
      <div className={styles.section}>
        <span className={styles.label}>싫어요</span>
        <div className={styles.buttonGroup}>
          <Button variant="default">오이</Button>
          <Button variant="default">파래</Button>
        </div>
      </div>
    </div>
  );
}
