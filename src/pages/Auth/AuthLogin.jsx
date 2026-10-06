// src/pages/Auth/AuthLogin.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '../UserContext';
import { googleLoginUrl, restoreSession } from '../../lib/auth';
import styles from './AuthLogin.module.css';
import LogoIcon from '../../assets/svg/Main/logo.svg?react';

// 로그인 흐름 (AGENTS.md 5.1): 백엔드가 OAuth를 끝내고 refresh_token 쿠키를 심은 뒤 main-url?from=oauth로 보낸다.
// 이 화면은 refresh 쿠키로 세션을 복원하고, 없으면 구글 로그인 버튼을 보여 준다.
// access 토큰은 URL로 받지 않는다 (C7)
export default function AuthLogin() {
  const { login } = useUser();
  const navigate = useNavigate();
  const [err, setErr] = useState('');

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const session = await restoreSession();
        if (ignore || !session) return;
        const { access, profile } = session;
        login(access, {
          id: profile.id,
          username: profile.name,
          email: profile.email,
          photoUrl: profile.picture,
        });
        navigate('/', { replace: true });
      } catch (e) {
        if (!ignore) setErr(e.message);
      }
    })();
    return () => {
      ignore = true;
    };
    // 화면에 들어올 때 한 번만 복원한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = () => {
    window.location.href = googleLoginUrl();
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoRow}>
        <LogoIcon className={styles.logoIcon} />
        <h1 className={styles.logoTitle}>오늘도 썩는 중</h1>
      </div>

      <h2 className={styles.title}>로그인</h2>
      <button className={styles.loginButton} onClick={handleLogin}>
        구글 계정 로그인
      </button>
      {err && <p role="alert">{err}</p>}
    </div>
  );
}
