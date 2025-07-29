import styles from './Button.module.css';

function Button(props) {
  const { variant = 'default' } = props;

  return <button variant={variant}>{props.children}</button>;
}

export default Button;
