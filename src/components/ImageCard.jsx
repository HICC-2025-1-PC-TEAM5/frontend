import styles from './ImageCard.module.css';

function ImageCard({ imageSrc, text, variant = 'small' }) {
  const variantClass = styles[`card-${variant}`];

  return (
    <div className={`${styles.card} ${variantClass}`}>
      <div className={styles.imageWrapper}>
        {imageSrc ? (
          <img src={imageSrc} alt={text} className={styles.image} />
        ) : (
          <div className={styles.placeholder}></div>
        )}
      </div>
      <p className={styles.text}>{text}</p>
    </div>
  );
}

export default ImageCard;
