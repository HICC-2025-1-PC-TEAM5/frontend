// src/pages/Auth/AuthCallback.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import api from '../../lib/api';
import { restoreSession } from '../../lib/auth';
import { useUser } from '../UserContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function AuthCallback() {
  const nav = useNavigate();
  const loc = useLocation();
  const { applyOAuthResponse, login } = useUser();
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
          // 응답 전체(이름/사진/토큰)를 컨텍스트에 반영. 토큰은 메모리에만 둔다 (D-036)
          applyOAuthResponse(data);
        } else {
          // 2) code/state가 없으면 → 백엔드가 이미 콜백을 끝내고 우리 도메인으로 리디렉션한 케이스
          // refresh 쿠키로 토큰과 프로필을 복구한다
          const session = await restoreSession();
          if (session) {
            login(session.access, {
              id: session.profile.id,
              username: session.profile.name,
              email: session.profile.email,
              photoUrl: session.profile.picture,
            });
          }
        }
        nav(backTo, { replace: true });
      } catch (e) {
        setErr(e?.message || '로그인 처리에 실패했습니다.');
      }
    })();
    // 콜백 주소에 들어올 때 한 번만 처리한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.search]);

  if (err) return <p style={{ padding: '1rem', color: 'crimson' }}>{err}</p>;
  return <p style={{ padding: '1rem' }}>로그인 처리 중…</p>;
}
