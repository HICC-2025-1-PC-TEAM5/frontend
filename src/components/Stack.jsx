import styles from './Stack.module.css';

export default (props) => {
  const {
    direction = 'horizontal',
    justify,
    align,
    gap = 'normal',
    wrap,
  } = props;

  return (
    <div
      className={styles.stack}
      direction={direction}
      justify={justify}
      align={align}
      gap={gap}
      wrap={wrap}
    >
      {props.children}
    </div>
  );
};
