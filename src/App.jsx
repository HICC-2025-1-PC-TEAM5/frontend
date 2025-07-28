import "./App.css";
import Button from "./components/primary/Button";
import TextInput from "./components/primary/TextInput";
import DateInput from "./components/primary/DateInput";
import OptionsInput from "./components/primary/OptionsInput";
import ImageCard from "./components/primary/ImageCard";
import ImageCoin from "./components/primary/ImageCoin";
import SelectHeader from "./components/Recipe/SelectHeader";
import Footer from "./components/primary/Footer";

function App() {
  return (
    <div>
      <SelectHeader />
      <br></br>
      <Button>버튼 내용 1</Button>
      <br></br>
      <Button variant="default">버튼 내용 2</Button>
      <br></br>
      <Button variant="primary">버튼 내용 2</Button>
      <br></br>
      <Button variant="danger">버튼 내용3</Button>
      <br></br>
      <ImageCard imageSrc="/img/a.jpg" text="재료 이름" />

      <br></br>
      <Button variant="primary">버튼 내용 2</Button>
      <br></br>
      <br></br>
      <TextInput
        type="number"
        placeholder="여기에 뭐를 입력하세요"
        label="라벨 이름"
        message="뭔가 메시지가 있습니다"
        error="에러 메시지가 있습니다"
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
