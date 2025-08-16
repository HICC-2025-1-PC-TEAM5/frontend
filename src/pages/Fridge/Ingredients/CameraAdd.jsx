// src/pages/Fridge/Ingredients/CameraAdd.jsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import RecognizedSheet from '../components/RecognizedSheet';
import Button from '../../../components/Button';
import styles from './CameraAdd.module.css';
import {
  extractIngredientsFromReceipt,
  extractIngredientsFromImage,
  addIngredients,
} from '../../../lib/fridge';
import { useUser } from '../../UserContext';

export default function CameraAdd() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: userId, token, isAuthed } = useUser();

  // mode: 'receipt' | 'photo' (쿼리스트링 mode=receipt 지원, 기본 photo)
  const search = new URLSearchParams(location.search);
  const mode = search.get('mode') === 'receipt' ? 'receipt' : 'photo';

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const thumbUrlRef = useRef(null); // ObjectURL 정리용

  const [sheetOpen, setSheetOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [ocrBoxes, setOcrBoxes] = useState([]); // 영수증 모드일 때 박스 표시용(데모)

  // ✅ 유저 인증 체크
  useEffect(() => {
    if (!isAuthed || !userId || !token) {
      alert(
        '로그인 정보가 없어 촬영을 진행할 수 없어요. 로그인 후 다시 시도해주세요.'
      );
      navigate('/login', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed, userId, token]);

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        streamRef.current = stream;

        const v = videoRef.current;
        if (v) {
          v.srcObject = stream;

          // 메타데이터가 로드되어 videoWidth/Height 확보될 때까지 대기
          await new Promise((res) => {
            if (v.readyState >= 1 && (v.videoWidth || v.videoHeight))
              return res();
            const onLoaded = () => {
              v.removeEventListener('loadedmetadata', onLoaded);
              res();
            };
            v.addEventListener('loadedmetadata', onLoaded, { once: true });
          });

          await v.play();
        }

        // 영수증 모드면 데모용 OCR 박스 표시
        if (mode === 'receipt') {
          setOcrBoxes([
            {
              position: 'absolute',
              top: '35%',
              left: '12%',
              width: '76%',
              height: '6%',
              border: '2px solid #00FFAA',
              borderRadius: '8px',
            },
            {
              position: 'absolute',
              top: '45%',
              left: '12%',
              width: '76%',
              height: '6%',
              border: '2px solid #00FFAA',
              borderRadius: '8px',
            },
            {
              position: 'absolute',
              top: '55%',
              left: '12%',
              width: '76%',
              height: '6%',
              border: '2px solid #00FFAA',
              borderRadius: '8px',
            },
          ]);
        } else {
          setOcrBoxes([]);
        }
      } catch (e) {
        console.error(e);
        alert('카메라 권한을 허용해주세요.');
        navigate(-1);
      }
    })();

    // 언마운트: 카메라/URL 정리
    return () => {
      streamRef.current?.getTracks()?.forEach((t) => t.stop());
      if (thumbUrlRef.current) URL.revokeObjectURL(thumbUrlRef.current);
    };
  }, [navigate, mode]);

  const handleCapture = async () => {
    try {
      const video = videoRef.current;
      if (!video) return;

      const vw = video.videoWidth || 1080;
      const vh = video.videoHeight || 1080;

      const canvas = document.createElement('canvas');
      canvas.width = vw;
      canvas.height = vh;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, vw, vh);

      const blob = await new Promise((res) =>
        canvas.toBlob(res, 'image/jpeg', 0.9)
      );
      if (thumbUrlRef.current) URL.revokeObjectURL(thumbUrlRef.current);
      const thumb = blob
        ? URL.createObjectURL(blob)
        : canvas.toDataURL('image/jpeg');
      if (blob) thumbUrlRef.current = thumb;

      // 기본 베이스(응답 없을 경우 대비)
      const baseItem = {
        id: crypto?.randomUUID?.() || Math.random().toString(36).slice(2),
        name: mode === 'receipt' ? '...' : '촬영한 재료',
        qty: 1,
        unit: '개',
        expire: '',
        thumb,
      };

      // ===== 서버 인식 분기 =====
      if (blob) {
        const fileName = mode === 'receipt' ? 'receipt.jpg' : 'ingredient.jpg';
        const file = new File([blob], fileName, { type: 'image/jpeg' });

        let recognized = [];
        if (mode === 'receipt') {
          // 영수증 → 기존 엔드포인트
          recognized = await extractIngredientsFromReceipt(userId, file); // [{name, category}, ...]
          // 참고: 이 경로는 기존 코드에서 이미 사용 중【】
        } else {
          // 사진 → 이미지 인식 엔드포인트
          recognized = await extractIngredientsFromImage({
            userId,
            token,
            file,
          }); // [{name, category}, ...] 기대【】
        }

        const normalized = (recognized || []).map((it) => ({
          id: crypto?.randomUUID?.() || Math.random().toString(36).slice(2),
          name: it.name || '이름 미상',
          category: it.category,
          qty: 1,
          unit: '개',
          expire: '',
          thumb,
        }));

        setItems(normalized.length ? normalized : [baseItem]);
      } else {
        // blob 생성 실패 시: 기본 아이템
        setItems([baseItem]);
      }

      setSheetOpen(true);
    } catch (err) {
      console.error(err);
      alert('사진 캡처/인식 중 오류가 발생했어요. 한 번만 다시 시도해볼까요?');
    }
  };

  const centerTitle = mode === 'receipt' ? '영수증 인식' : '사진 촬영';

  const handleClose = () => setSheetOpen(false);

  const handleComplete = (finalItems) => {
    (async () => {
      try {
        if (!userId) throw new Error('사용자 정보가 없습니다');

        const withType = finalItems.map((it) => ({
          ...it,
          type: it.type || '냉장고',
        }));
        const text = await addIngredients(userId, withType);

        alert('재료가 등록됐어요');
        navigate(-1);
      } catch (err) {
        if (err.status === 400) alert('요청 형식이 올바르지 않아요');
        else if (err.status === 401) alert('로그인이 필요합니다');
        else if (err.status === 403) alert('권한이 없습니다');
        else if (err.status === 404) alert('요청 대상이 없습니다');
        else if (err.status === 408)
          alert('요청 시간이 초과됐습니다 다시 시도해주세요');
        else alert(err.message || '알 수 없는 오류입니다');
        console.error(err);
      }
    })();
  };

  return (
    <>
      {/* 상단 헤더 */}
      <div className={styles.header}>
        <Button variant="invisible" icon="only" onClick={() => navigate(-1)}>
          X
        </Button>
        <p className={styles.title}>재료 등록</p>
      </div>

      {/* 카메라 미리보기 */}
      <div className={styles.cameraWrap}>
        <video
          ref={videoRef}
          className={styles.video}
          playsInline
          muted
          autoPlay
        />
        <div className={styles.mask}>
          <div className={styles.frame} />
          <p className={styles.help}>{centerTitle}</p>

          {/* 영수증 모드일 때만 OCR 박스 표시 */}
          {mode === 'receipt' &&
            ocrBoxes.map((b, i) => <span key={i} style={b} aria-hidden />)}
        </div>
      </div>

      {/* 모드 탭 (표시만; 쿼리스트링으로 활성화) */}
      <div className={styles.modeTabs}>
        <span
          className={`${styles.mode} ${mode === 'receipt' ? styles.active : ''}`}
        >
          영수증 인식
        </span>
        <span
          className={`${styles.mode} ${mode === 'photo' ? styles.active : ''}`}
        >
          사진 촬영
        </span>
      </div>

      {/* 셔터 버튼 */}
      <div className={styles.shutterWrap}>
        <button
          className={styles.shutter}
          onClick={handleCapture}
          aria-label="촬영"
        />
      </div>

      {/* 인식 결과 시트 */}
      <RecognizedSheet
        open={sheetOpen}
        items={items}
        onClose={handleClose}
        onComplete={handleComplete}
      />
    </>
  );
}
