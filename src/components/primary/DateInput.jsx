import './TextInput.css';

export default function (props) {
  const { type = 'text', placeholder, label, message, error } = props;

  return (
    <div>
      <label>{label}</label>
      <input type='datetime-local'>{props.children}</input>
      <p className='message error'>{error}</p>
      <p className='message'>{message}</p>
    </div>
  );
}
