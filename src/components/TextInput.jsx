import './TextInput.css';

export default function (props) {
  const { type = 'text', placeholder, label, message, error } = props;

  return (
    <div>
      <label>{label}</label>
      <input type={type} placeholder={placeholder} spellCheck="false">
        {props.children}
      </input>
      <p className="message error">{error}</p>
      <p className="message">{message}</p>
    </div>
  );
}
