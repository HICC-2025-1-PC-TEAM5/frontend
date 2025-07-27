import './OptionsInput.css';

export default function (props) {
  const { type = 'text', placeholder, label, message, error } = props;

  return (
    <div>
      <label>{label}</label>
      <select type={type} placeholder={placeholder} spellCheck='false'>
        {props.children}
      </select>
      <p className='message error'>{error}</p>
      <p className='message'>{message}</p>
    </div>
  );
}
