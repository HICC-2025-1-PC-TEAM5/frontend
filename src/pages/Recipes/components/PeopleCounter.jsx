import { useState } from 'react';
import styles from './PeopleCounter.module.css';
import Button from '../../../components/Button';
import Stack from '../../../components/Stack';

export default function PeopleCounter({
  min = 1,
  initial = 1,
  onChange,
  onStartCooking, // 콜백
}) {
  const [count, setCount] = useState(initial);

  const handleChange = (newValue) => {
    if (newValue >= min) {
      setCount(newValue);
      if (onChange) onChange(newValue); // 인분 변경 알림
    }
  };

  return (
    <Stack justify="space-between" align="center" fill="all">
      <div className={styles.people}>
        <Button
          size="small"
          border="round"
          onClick={() => handleChange(count - 1)}
          disabled={count === min}
        >
          -
        </Button>
        <span className={styles.count}>{count} 인분</span>
        <Button
          size="small"
          border="round"
          onClick={() => handleChange(count + 1)}
        >
          +
        </Button>
      </div>

      <Button variant="primary" onClick={onStartCooking}>
        조리시작
      </Button>
    </Stack>
  );
}
