import styles from './AlertCard.module.css';
import Button from '../../../components/Button';
import Stack from '../../../components/Stack';
import alertBg from '../../../assets/image/alertcard.png';

export default function AlertCard({ onClick }) {
  return (
    <div
      className={styles.card}
      style={{
        backgroundImage: `url(${alertBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Stack fill="all" direction="vertical" justify="space-between">
        <p className={styles.message}>냉장고에 임박한 재료가 있어요</p>
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
