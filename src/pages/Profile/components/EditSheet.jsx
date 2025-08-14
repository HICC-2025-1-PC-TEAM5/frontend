import { useEffect, useState } from 'react';
import styles from './EditSheet.module.css';
import Button from '../../../components/Button';

export default function EditSheet({ open, initial, onClose, onSubmit }) {
  const [likes, setLikes] = useState(initial?.likes ?? []);
  const [dislikes, setDislikes] = useState(initial?.dislikes ?? []);
  const [allergies, setAllergies] = useState(initial?.allergies ?? []);

  const [likeInput, setLikeInput] = useState('');
  const [dislikeInput, setDislikeInput] = useState('');
  const [allergyInput, setAllergyInput] = useState('');

  useEffect(() => {
    if (open) {
      setLikes(initial?.likes ?? []);
      setDislikes(initial?.dislikes ?? []);
      setAllergies(initial?.allergies ?? []);
      setLikeInput('');
      setDislikeInput('');
      setAllergyInput('');
    }
  }, [open, initial]);

  if (!open) return null;

  const addUniq = (v, list, setList) => {
    const x = (v || '').trim();
    if (!x) return;
    if (!list.includes(x)) setList([...list, x]);
  };

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className={styles.sheet} role="dialog" aria-modal="true">
        <div className={styles.handle} />

        {/* 좋아요 */}
        <h3 className={styles.heading}>좋아하는 음식</h3>
        <div className={styles.row}>
          <input
            className={styles.input}
            value={likeInput}
            onChange={(e) => setLikeInput(e.target.value)}
            placeholder="예: 면, 매운 요리, 양식"
          />
          <Button
            size="small"
            onClick={() => {
              addUniq(likeInput, likes, setLikes);
              setLikeInput('');
            }}
          >
            추가
          </Button>
        </div>
        <div className={styles.chips}>
          {likes.map((name) => (
            <button
              key={name}
              className={styles.chip}
              onClick={() => setLikes(likes.filter((n) => n !== name))}
              type="button"
            >
              {name}
              <span className={styles.chipX} aria-hidden>
                ×
              </span>
            </button>
          ))}
        </div>

        {/* 싫어요 */}
        <h3 className={styles.heading} style={{ marginTop: '1rem' }}>
          싫어하는 음식
        </h3>
        <div className={styles.row}>
          <input
            className={styles.input}
            value={dislikeInput}
            onChange={(e) => setDislikeInput(e.target.value)}
            placeholder="예: 오이, 고수"
          />
          <Button
            size="small"
            onClick={() => {
              addUniq(dislikeInput, dislikes, setDislikes);
              setDislikeInput('');
            }}
          >
            추가
          </Button>
        </div>
        <div className={styles.chips}>
          {dislikes.map((name) => (
            <button
              key={name}
              className={`${styles.chip} ${styles.danger}`}
              onClick={() => setDislikes(dislikes.filter((n) => n !== name))}
              type="button"
            >
              {name}
              <span className={styles.chipX} aria-hidden>
                ×
              </span>
            </button>
          ))}
        </div>

        {/* 알레르기 */}
        <h3 className={styles.heading} style={{ marginTop: '1rem' }}>
          알레르기
        </h3>
        <div className={styles.row}>
          <input
            className={styles.input}
            value={allergyInput}
            onChange={(e) => setAllergyInput(e.target.value)}
            placeholder="예: 땅콩, 갑각류, 우유"
          />
          <Button
            size="small"
            onClick={() => {
              addUniq(allergyInput, allergies, setAllergies);
              setAllergyInput('');
            }}
          >
            추가
          </Button>
        </div>
        <div className={styles.chips}>
          {allergies.map((name) => (
            <button
              key={name}
              className={styles.chip}
              onClick={() => setAllergies(allergies.filter((n) => n !== name))}
              type="button"
            >
              {name}
              <span className={styles.chipX} aria-hidden>
                ×
              </span>
            </button>
          ))}
        </div>

        <div className={styles.actions}>
          <Button variant="invisible" onClick={onClose}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={() => onSubmit?.({ likes, dislikes, allergies })}
          >
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}
