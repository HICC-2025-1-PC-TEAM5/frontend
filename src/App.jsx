import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Button from './components/primary/Button';
import TextInput from './components/primary/TextInput';
import DateInput from './components/primary/DateInput';
import OptionsInput from './components/primary/OptionsInput';

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
        message='뭔가 메시지가 있습니다'
        error='에러 메시지가 있습니다'
      ></TextInput>

      <DateInput></DateInput>

      <OptionsInput>
        <option>선택지 1번</option>
        <option>선택지 2번</option>
        <option>선택지 3번 옵션은 이름이 더 길다랗게 적혀 있음</option>
      </OptionsInput>
    </div>
  );
}

export default App;
