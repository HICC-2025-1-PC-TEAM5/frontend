import styles from './RecipeHistory.module.css'; 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../UserContext';

export default function RecipeHistory() {
  const { id: userId, token } = useUser();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // viewAt 기준으로 몇일 전 계산
  const getDaysAgo = (dateString) => {
    const viewDate = new Date(dateString);
    const now = new Date();
    const diffTime = now - viewDate; // 밀리초 차이
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // 일 단위

    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    return `${diffDays}일 전`;
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/users/${userId}/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data);
        setHistory(res.data.history || []);
      } catch (err) {
        if (err.response) {
          switch (err.response.status) {
            case 400: setError('잘못된 요청입니다.'); break;
            case 401: setError('로그인 인증이 필요합니다.'); break;
            case 403: setError('권한이 없습니다.'); break;
            case 404: setError('기록을 찾을 수 없습니다.'); break;
            case 408: setError('요청 시간이 초과되었습니다.'); break;
            default: setError('알 수 없는 오류가 발생했습니다.');
          }
        } else {
          setError('서버와 연결할 수 없습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId, token]);

  if (loading) return <p className={styles.empty}>불러오는 중...</p>;
  if (error) return <p className={styles.empty}>{error}</p>;
  if (history.length === 0) return <p className={styles.empty}>요리 기록이 없습니다.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        {history.map((item) => (
          <div key={item.id} className={styles.historyItem}>
            <img 
              src={item.image} 
              alt={item.name} 
              className={styles.recipeImage} 
            />
            <div className={styles.info}>
              <span className={styles.name}>{item.name}</span>
              <span className={styles.daysAgo}>{getDaysAgo(item.viewAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

