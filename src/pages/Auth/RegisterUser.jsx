import { useUser } from '../UserContext';

export default function UsernameForm() {
  const { setUsername } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.username.value.trim();
    if (!name) return; // 빈 값 방지
    setUsername(name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="이름 입력" required />
      <button type="submit">저장</button>
    </form>
  );
}
