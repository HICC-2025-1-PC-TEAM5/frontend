import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import styles from './AuthLogin.module.css';
import LogoIcon from '../../assets/svg/Main/logo.svg?react';

const API = import.meta.env.VITE_API_BASE_URL; // ✅ .env 값 불러오기

export default function AuthLogin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogin = () => {
    window.location.href = `${API}/api/v2/oauth2/google`;
  };

  const restoreSession = async () => {
    setLoading(true);
    try {
      const r1 = await fetch(`${API}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!r1.ok) {
        setLoading(false);
        return;
      }
      const j1 = await r1.json();
      const access = j1?.data?.access;
      if (!access) {
        setLoading(false);
        return;
      }

      localStorage.setItem('access', access);

      const r2 = await fetch(`${API}/api/users/me`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      if (!r2.ok) {
        setLoading(false);
        return;
      }
      const j2 = await r2.json();
      setUser(j2?.data ?? j2);

      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('from') === 'oauth') {
      restoreSession().finally(() => {
        params.delete('from');
        const clean = params.toString();
        const newUrl = `${window.location.pathname}${clean ? `?${clean}` : ''}${window.location.hash || ''}`;
        window.history.replaceState(null, '', newUrl);
      });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.logoRow}>
        <LogoIcon className={styles.logoIcon} />
        <h1 className={styles.logoTitle}>오늘도 썩는 중</h1>
      </div>

      <h2 className={styles.title}>로그인</h2>

      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <button className={styles.loginButton} onClick={handleLogin}>
          구글 계정 로그인
        </button>
      )}
    </div>
  );
}
