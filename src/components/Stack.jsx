import styles from './Stack.module.css';

export default (props) => {
  const {
    className,
    fill,
    direction = 'horizontal',
    justify,
    align,
    gap = 'normal',
    wrap,
    rows,
    cols,
  } = props;

  return (
    <div
      className={`${styles.stack} ${className}`}
      fill={fill}
      direction={direction}
      justify={justify}
      align={align}
      gap={gap}
      wrap={wrap}
      rows={rows}
      cols={cols}
    >
      {props.children}
    </div>
  );
};
