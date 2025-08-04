import styles from './TextInput.module.css';

export default function DateInput(props) {
  const { placeholder, label, message, error } = props;
  const inputId = `input-${label}`;

  return (
    <div className={styles.container}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input
        id={inputId}
        type="date"
        placeholder={placeholder}
        className={styles.input}
      />
      {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
