// src/pages/Profile/components/ProfileHeader.jsx
import { useMemo } from 'react';
import { useUser } from '../../UserContext';
import styles from './ProfileHeader.module.css';

export default function ProfileHeader() {
  const { username, photoUrl } = useUser() || {};
  const display = useMemo(() => username?.trim() || '사용자', [username]);

  return (
    <div className={styles.header}>
      <div className={styles.avatarBox}>
        {photoUrl ? (
          <img
            className={styles.avatar}
            src={photoUrl}
            alt={`${display} 프로필 사진`}
          />
        ) : (
          <div className={styles.avatarFallback} aria-hidden>
            {display[0]}
          </div>
        )}
      </div>
      <div className={styles.meta}>
        <p className={styles.name}>
          <strong>{display}</strong>님
        </p>
      </div>
    </div>
  );
}
