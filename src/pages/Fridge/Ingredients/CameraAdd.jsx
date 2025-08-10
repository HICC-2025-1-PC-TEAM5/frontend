// src/pages/Fridge/Ingredients/CameraAdd.jsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import RecognizedSheet from '../components/RecognizedSheet';
import Button from '../../../components/Button';
import styles from './CameraAdd.module.css';

export default function CameraAdd() {
  const navigate = useNavigate();
  const location = useLocation();

  // mode: 'receipt' | 'photo' (쿼리스트링 mode=receipt 지원, 기본 photo)
  const search = new URLSearchParams(location.search);
  const mode = search.get('mode') === 'receipt' ? 'receipt' : 'photo';

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [ocrBoxes, setOcrBoxes] = useState([]); // 영수증 모드일 때 박스 표시용(데모)

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

        // 영수증 모드면 데모용 OCR 박스 몇 개 보여주기
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

    // 언마운트 시 카메라 정지
    return () => streamRef.current?.getTracks()?.forEach((t) => t.stop());
  }, [navigate, mode]);

  const handleCapture = async () => {
    try {
      const video = videoRef.current;
      if (!video) return;

      // videoWidth/Height가 0일 수 있어 fallback 지정
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
      const thumb = blob
        ? URL.createObjectURL(blob)
        : canvas.toDataURL('image/jpeg');

      // 데모 인식 결과 (thumb는 모드와 무관하게 항상 items에 포함)
      const demo = [
        {
          id: crypto?.randomUUID?.() || Math.random().toString(36).slice(2),
          name: mode === 'receipt' ? '양파' : '양상추',
          qty: 1,
          unit: '개',
          expire: '',
          thumb,
        },
      ];
      setItems(demo);
      setSheetOpen(true);
    } catch (err) {
      console.error(err);
      alert('사진 캡처 중 오류가 발생했어요. 한 번만 다시 시도해볼까요?');
    }
  };

  const centerTitle = mode === 'receipt' ? '영수증 인식' : '사진 촬영';

  const handleClose = () => setSheetOpen(false);
  const handleComplete = (finalItems) => {
    console.log('최종 등록할 재료:', finalItems);
    // TODO: 서버 저장 로직
    navigate(-1);
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

          {/* 영수증 모드일 때만 OCR 박스 표시 (인라인 스타일로 안전하게) */}
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
