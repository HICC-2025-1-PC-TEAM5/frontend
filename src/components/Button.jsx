import styles from './Button.module.css';

export default function Button(props) {
  const {
    variant = 'default',
    border,
    size,
    icon,
    onClick,
    className,
    type = 'button',
    children,
    ...rest
  } = props;

  return (
    <button
      type={type}
      variant={variant}
      border={border}
      size_={size}
      icon={icon}
      onClick={onClick}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
}
