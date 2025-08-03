import styles from './ImageCard.module.css';
import Stack from './Stack';

function ImageCard(props) {
  const { imageSrc, title, text, variant = 'small', desc } = props;
  const variantClass = styles[`card-${variant}`];

  return (
    <Stack className={styles.card} direction="vertical" gap="none">
      <div className={styles.imageWrapper}>
        {imageSrc ? (
          <img src={imageSrc} alt={text} className={styles.image} />
        ) : (
          <div className={styles.placeholder}></div>
        )}
      </div>
      <div className={styles.textWrapper}>
        <p className={styles.title}>{title || text}</p>
        {desc ? <p className={styles.desc}>{desc}</p> : null}
      </div>
    </Stack>
  );
}

export default ImageCard;
