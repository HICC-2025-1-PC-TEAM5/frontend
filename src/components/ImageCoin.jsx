import styles from './ImageCoin.module.css';
import Stack from './Stack';

function ImageCard({ imageSrc, text, variant = 'medium' }) {
  const hasImage = Boolean(imageSrc);
  const variantClass = styles[`box-${variant}`];

  return (
    <Stack className={styles.card} direction="vertical">
      <div className={styles.imageWrapper}></div>
      {hasImage ? (
        <img src={imageSrc} alt={text} className={styles.boxImage} />
      ) : (
        <div className={styles.boxPlaceholder} />
      )}
      <p className={styles.boxText}>{text}</p>
    </Stack>
  );
}

export default ImageCard;
