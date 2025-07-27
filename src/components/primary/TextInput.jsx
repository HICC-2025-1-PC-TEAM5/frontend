import styles from './TextInput.module.css';

function Button(props) {
  const { type = 'text', placeholder, label } = props;

  return (
    <div>
      <label>{label}</label>
      <input type={type} placeholder={placeholder}>
        {props.children}
      </input>
    </div>
  );
}

export default Button;
