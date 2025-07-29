import { Link } from 'react-router';
import Button from '../../components/Button';

export default function () {
  return (
    <>
      <h1>Intro</h1>

      <Link to="https://google.com" rel="noopener noreferrer">
        <Button variant="primary">시작하기</Button>
      </Link>

      <Link to="https://google.com" rel="noopener noreferrer">
        <Button>로그인</Button>
      </Link>
    </>
  );
}
