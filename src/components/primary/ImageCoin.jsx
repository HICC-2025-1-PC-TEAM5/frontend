import styles from "./ImageCoin.module.css";

function ImageCard({ imageSrc, text, variant = "medium" }) {
  const hasImage = Boolean(imageSrc);
  const variantClass = styles[`box-${variant}`];

  return (
    <div className={`${styles.box} ${variantClass}`}>
      {hasImage ? (
        <img src={imageSrc} alt={text} className={styles.boxImage} />
      ) : (
        <div className={styles.boxPlaceholder} />
      )}
      <p className={styles.boxText}>{text}</p>
    </div>
  );
}

export default ImageCard;
