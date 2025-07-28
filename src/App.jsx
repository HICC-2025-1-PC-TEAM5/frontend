import "./App.css";
import Button from "./components/primary/Button";
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
      <ImageCoin imageSrc="" text="재료 처리" variant="medium" />
      <Footer />
    </div>
  );
}

export default App;
