import styles from './Button.module.css';

export default (props) => {
  const { variant = 'default', border, size, icon, onClick } = props;

  return (
    <button
      variant={variant}
      border={border}
      size_={size}
      icon={icon}
      onClick={onClick}
    >
      {props.children}
    </button>
  );
};
