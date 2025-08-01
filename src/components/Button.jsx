import styles from './Button.module.css';

function Button({ children, variant = 'default', onClick, disabled, ...rest }) {
  return (
    <button variant={variant} onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}

export default Button;
