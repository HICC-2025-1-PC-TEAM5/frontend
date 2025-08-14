import styles from './PreferenceInfo.module.css';
import Button from '../../../components/Button';

export default function PreferenceInfo() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>요리 맞춤 정보</h2>
      <p className={styles.description}>
        알레르기 정보와 가지고 있는 도구로 더 똑똑한 추천을 받아보세요.
      </p>

      <div className={styles.section}>
        <span className={styles.label}>알레르기</span>
        <div className={styles.buttonGroup}>
          <Button variant="normal">게</Button>
          <Button variant="default">땅콩</Button>
        </div>
      </div>
      <div className={styles.section}>
        <span className={styles.label}>조리도구</span>
        <div className={styles.buttonGroup}>
          <Button variant="default">오븐</Button>
          <Button variant="default">전자레인지</Button>
        </div>
      </div>
    </div>
  );
}
