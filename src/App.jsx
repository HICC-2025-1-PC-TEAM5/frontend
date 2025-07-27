import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Button from './components/primary/Button';
import TextInput from './components/primary/TextInput';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Button>버튼 내용 1</Button>
      <br></br>
      <Button variant='invisible'>버튼 내용 2</Button>
      <br></br>
      <Button variant='primary'>버튼 내용 2</Button>
      <br></br>
      <br></br>
      <TextInput
        type='number'
        placeholder='여기에 뭐를 입력하세요'
        label='라벨 이름'
      ></TextInput>
    </div>
  );
}

export default App;
