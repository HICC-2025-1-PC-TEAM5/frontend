import styles from './ImageCoin.module.css';
import Stack from './Stack';

function ImageCard({ imageSrc, text, variant = 'medium' }) {
  const hasImage = Boolean(imageSrc);

  return (
    <div className={styles.imageCoin} variant={variant}>
      <Stack direction="vertical" fill="width" gap="narrow">
        <div className={styles.imageWrapper}>
          {hasImage ? (
            <img src={imageSrc} alt={text} className={styles.image} />
          ) : (
            <div className={styles.imagePl} />
          )}
        </div>
        <p className={styles.text}>{text}</p>
      </Stack>
    </div>
  );
}

export default ImageCard;
