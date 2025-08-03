export default function TextInput(props) {
  return (
    <div className="outwrapper">
      <div className="inwrapper">{props.children}</div>
    </div>
  );
}
