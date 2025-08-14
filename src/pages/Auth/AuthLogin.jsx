// src/pages/Auth/AuthLogin.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import styles from './AuthLogin.module.css';
import LogoIcon from '../../assets/svg/Main/logo.svg?react';
import { useUser } from '../UserContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL; // .env 값

export default function AuthLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthed } = useUser() || {};
  const from = location.state?.from?.pathname || '/';

  // 이미 로그인 상태면 돌아가기
  useEffect(() => {
    if (isAuthed) navigate(from, { replace: true });
  }, [isAuthed, from, navigate]);

  // 구글 OAuth 시작
  const handleLogin = () => {
    // 프론트 콜백으로 돌아오게 설정(백엔드가 redirect_uri 지원 시)
    const redirectUri = `${window.location.origin}/auth/callback?from=${encodeURIComponent(
      from
    )}`;
    const withRedirect = `${API_BASE}/api/v2/oauth2/google?redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;
    const fallback = `${API_BASE}/api/v2/oauth2/google`;

    // 우선 redirect_uri 포함해서 시도
    window.location.assign(withRedirect);

    // 서버가 redirect_uri를 지원하지 않아도,
    // 기본 콜백으로 리다이렉트된 뒤 AuthCallback에서 처리하면 됨.
    // 필요하면 try/catch로 실패 감지 후 fallback으로 재시도 가능.
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
    </div>
  );
}
