import { useNavigate } from 'react-router';
import Wrapper from '../../../components/Wrapper';
import Stack from '../../../components/Stack';
import Button from '../../../components/Button';
import styles from './AddForm.module.css';
import ReceiptIcon from '../../../assets/svg/Fridge/receipt.svg?react';
import CameraIcon from '../../../assets/svg/Fridge/camera.svg?react';
import TextIcon from '../../../assets/svg/Fridge/text.svg?react';

export default function AddForm() {
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);
  const goReceipt = () =>
    navigate('/fridge/ingredients/add/camera?mode=receipt');
  const goPhoto = () => navigate('/fridge/ingredients/add/camera?mode=phto');

  return (
    <>
      <div className={styles.header}>
        <Wrapper fill="height">
          <Stack justify="space-between" align="center" fill="all" gap="none">
            <div className={styles.headerSide}>
              <Button variant="invisible" icon="only" onClick={handleBack}>
                X
              </Button>
            </div>
            <div className={styles.headerMain}>
              <p className={styles.headerTitle}>재료 등록</p>
            </div>
            <div className={styles.headerSide}></div>
          </Stack>
        </Wrapper>
      </div>

      <div className={styles.headerMargin}></div>

      <Wrapper>
        <div className={styles.guide}>
          <h1 className={styles.title}>재료 등록 방법을 선택해보세요</h1>
          <p className={styles.description}>
            사진으로 빠르게 등록하거나 직접 입력할 수 있어요
          </p>
        </div>

        {/* 등록 카드 */}
        <div className={styles.cardList}>
          <button className={styles.card} onClick={goReceipt}>
            <ReceiptIcon className={styles.icon} />
            <h3 className={styles.cardTitle}>영수증 촬영</h3>
            <p className={styles.cardDesc}>
              영수증을 찍어서 재료를 <br /> 빠르게 인식해서 등록해요
            </p>
          </button>

          <button className={styles.card} onClick={goPhoto}>
            <CameraIcon className={styles.icon} />
            <h3 className={styles.cardTitle}>사진 촬영</h3>
            <p className={styles.cardDesc}>
              재료를 하나씩 촬영해 <br /> 등록할 수 있어요
            </p>
          </button>

          <button className={styles.card}>
            <TextIcon className={styles.icon} />
            <h3 className={styles.cardTitle}>직접 입력</h3>
            <p className={styles.cardDesc}>
              직접 재료를 하나씩 <br /> 입력해서 등록해요
            </p>
          </button>
        </div>

        <div className={styles.checkboxRow}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" />
            다음부터는 자주 쓰는 방식으로 계속 사용할래요
          </label>
        </div>
      </Wrapper>
    </>
  );
}
