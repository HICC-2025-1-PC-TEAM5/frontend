// src/pages/Auth/AuthLogin.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../UserContext';
import styles from './AuthLogin.module.css';
import LogoIcon from '../../assets/svg/Main/logo.svg?react';

const API = 'http://localhost:8080';

export default function AuthLogin() {
  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // 1️⃣ 쿼리 파라미터에 access token이 있으면 바로 로그인 처리
  const handleOAuthCallback = async () => {
    const params = new URLSearchParams(location.search);
    const access = params.get('access');

    if (access) {
      login({ token: access, username: '사용자' }); // username은 임시, 필요 시 서버에서 가져오세요
      params.delete('access');
      const clean = params.toString();
      const newUrl = `${location.pathname}${clean ? `?${clean}` : ''}${location.hash || ''}`;
      window.history.replaceState(null, '', newUrl);
      navigate('/', { replace: true });
      return true;
    }
    return false;
  };

  // 2️⃣ 세션 복원: access 없으면 refresh 호출
  const restoreSession = async () => {
    const res = await fetch(`${API}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) return;

    const j = await res.json();
    const access = j?.data?.access;
    if (!access) return;

    // 1) access token 저장
    login({ access, username: '...' }); // 임시

    // 2) 사용자 정보 조회
    const userRes = await fetch(`${API}/api/users/me`, {
      headers: { Authorization: `Bearer ${access}` },
    });
    const userJson = await userRes.json();

    login({
      access,
      id: userJson?.data?.id,
      username: userJson?.data?.name,
      email: userJson?.data?.email,
      picture: userJson?.data?.picture,
    });

    navigate('/', { replace: true });
  };

  useEffect(() => {
    // 먼저 URL에서 access token 처리
    handleOAuthCallback().then((handled) => {
      if (!handled) {
        // 없으면 refresh 시도
        restoreSession();
      }
    });
  }, [location]);

  const handleLogin = () => {
    window.location.href = `${API}/api/v2/oauth2/google`;
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
