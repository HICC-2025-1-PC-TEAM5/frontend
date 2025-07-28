import { useParams } from 'react-router';

export default function () {
  let { id } = useParams();

  return (
    <>
      <h2>재료 페이지</h2>
      <p>재료 id: {id}</p>
    </>
  );
}
