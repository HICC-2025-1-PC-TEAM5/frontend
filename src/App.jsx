import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Button from './components/primary/Button';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Button>버튼 내용 1</Button>
      <br></br>
      <Button variant='invisible'>버튼 내용 2</Button>
      <br></br>
      <Button variant='primary'>버튼 내용 2</Button>
    </div>
  );
}

export default App;
