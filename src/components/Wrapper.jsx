import styles from './Wrapper.module.css';

export default (props) => {
  const { fill } = props;

  return (
    <div className={styles.outwrapper} fill={fill}>
      <div className={styles.inwrapper} fill={fill}>
        {props.children}
      </div>
    </div>
  );
};
