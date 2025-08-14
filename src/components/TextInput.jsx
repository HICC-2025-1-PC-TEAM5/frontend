import styles from './TextInput.module.css';

export default function TextInput(props) {
  const { type = 'text', placeholder, label, message, error } = props;

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        className={styles.input}
        type={type}
        placeholder={placeholder}
        spellCheck="false"
      />
      {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
      {message && !error && <p className={styles.message}>{message}</p>}
    </div>
  );
}
