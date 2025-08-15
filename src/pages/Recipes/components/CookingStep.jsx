import Button from '../../../components/Button';
import styles from './CookingStep.module.css';

export default function CookingStep({ stepNumber, title, description }) {
  return (
    <div className={styles.container}>
      <Button size="small">{stepNumber}</Button>
      <div className={styles.text}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
}
