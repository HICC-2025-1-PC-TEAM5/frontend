// src/pages/Auth/AuthCallback.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import api from '../../lib/api';
import { useUser } from '../UserContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function AuthCallback() {
  const nav = useNavigate();
  const loc = useLocation();
  const { applyOAuthResponse, login, setUserFromOAuth } = useUser();
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      const qs = new URLSearchParams(loc.search);
      const code = qs.get('code');
      const state = qs.get('state');
      const backTo = qs.get('from') || '/';

      try {
        if (code && state) {
          // 1) 프론트 콜백 URL에 code/state가 실려 온 경우 → 백엔드 콜백 엔드포인트 호출
          const url = `${API_BASE}/api/v2/oauth2/google/callback?code=${encodeURIComponent(
            code
          )}&state=${encodeURIComponent(state)}`;

          const { data } = await api.get(url); // withCredentials=true라 쿠키 세팅 됨
          // 권장: 응답 전체를 컨텍스트에 일괄 반영(이름/사진/토큰)
          if (typeof applyOAuthResponse === 'function') {
            applyOAuthResponse(data);
          } else {
            // 구버전 안전망: 프로필/토큰 따로 반영
            if (data?.user) setUserFromOAuth(data.user);
            const token = data?.tokens?.accessToken;
            if (token) login(token);
          }
        } else {
          // 2) code/state가 없으면 → 백엔드가 이미 콜백을 끝내고 우리 도메인으로 리디렉션한 케이스
          // refresh 쿠키로 액세스 토큰만 복구
          const { data } = await api.post('/api/auth/refresh');
          const token = data?.data?.access;
          if (token) login(token);
          // (프로필은 필요시 별도 /me 엔드포인트가 있으면 거기서 가져오면 됨)
        }
        nav(backTo, { replace: true });
      } catch (e) {
        setErr(e?.message || '로그인 처리에 실패했습니다.');
      }
    })();
  }, [loc.search, nav, applyOAuthResponse, login, setUserFromOAuth]);

  if (err) return <p style={{ padding: '1rem', color: 'crimson' }}>{err}</p>;
  return <p style={{ padding: '1rem' }}>로그인 처리 중…</p>;
}
