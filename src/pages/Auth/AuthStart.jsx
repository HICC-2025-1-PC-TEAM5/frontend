import { Link } from 'react-router';

export default function () {
  return (
    <>
      <h1>로그인 페이지</h1>

      <Link to="https://google.com" rel="noopener noreferrer">
        <Button>구글 계정으로 시작하기</Button>
      </Link>
    </>
  );
}
