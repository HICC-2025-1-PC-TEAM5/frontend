import styles from './Stars.module.css';
import Stack from './Stack';

export default (props) => {
  const { level, text } = props;

  let stars = [];
  let l = level * 1;
  for (let i = 0; i < 5; i++) {
    stars.push(
      <div
        key={i}
        className={`${styles.star} ${l > i ? styles.filled : null}`}
      ></div>
    );
  }

  return (
    <div className={styles.stars}>
      <Stack
        className={styles.starsStack}
        justify="center"
        align="center"
        gap="narrow"
      >
        {stars}
      </Stack>
      <div className={styles.text}>{text}</div>
    </div>
  );
};
