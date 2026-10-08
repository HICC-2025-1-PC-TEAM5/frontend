// src/pages/Auth/AuthLogin.jsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useUser } from '../UserContext';
import { googleLoginUrl } from '../../lib/auth';
import styles from './AuthLogin.module.css';
import LogoIcon from '../../assets/svg/Main/logo.svg?react';

// 로그인 흐름 (AGENTS.md 5.1): 백엔드가 OAuth를 끝내고 refresh_token 쿠키를 심은 뒤 main-url?from=oauth로 보낸다.
// 세션 복원(refresh 쿠키)은 UserContext가 하고, 이 화면은 복원되지 않았을 때 구글 로그인 버튼을 보여 준다.
// access 토큰은 URL로 받지 않는다 (C7)
export default function AuthLogin() {
  const { isAuthed, isChecking, restoreError } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // 세션 복원은 UserContext가 앱 시작 시 한다 (D-036). 복원되면 원래 가려던 화면으로 보낸다
  useEffect(() => {
    if (isAuthed)
      navigate(location.state?.from?.pathname || '/', { replace: true });
  }, [isAuthed, navigate, location.state]);

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
      {isChecking && <p>로그인 확인 중…</p>}
      {restoreError && <p role="alert">{restoreError}</p>}
    </div>
  );
}
