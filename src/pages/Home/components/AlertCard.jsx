import styles from './AlertCard.module.css';
import Button from '../../../components/Button';
import Stack from '../../../components/Stack';

export default function AlertCard({ onClick }) {
  return (
    <div className={styles.card}>
      <Stack fill="all" direction="vertical" justify="space-between">
        <p className={styles.message}>빠르게 소비해야 하는 재료가 3개 있어요</p>
        <div className={styles.actionArea}>
          <Stack justify="end">
            <Button
              variant="default"
              border="round"
              className={styles.customButton}
              onClick={onClick}
            >
              냉장고 바로가기
            </Button>
          </Stack>
        </div>
      </Stack>
    </div>
  );
}
