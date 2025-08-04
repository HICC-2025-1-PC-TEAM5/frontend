import { useNavigate } from 'react-router';
import { useState } from 'react';
import Button from '../../../components/Button';
import Nav from '../../../components/Nav';
import TextInput from '../../../components/TextInput';
import DateInput from '../../../components/DateInput';
import Wrapper from '../../../components/Wrapper';
import Stack from '../../../components/Stack';
import OptionsInput from '../../../components/OptionsInput';
import styles from './ProfileSetting.module.css';

export default function ProfileSetting() {
  const navigate = useNavigate();
  const [selectedPurpose, setSelectedPurpose] = useState(null);

  const cookingPurposes = ['맛있게 먹는 게 중요해요', '건강을 위해 요리해요'];

  const handlePurposeClick = (purpose) => {
    setSelectedPurpose(purpose);
  };

  return (
    <>
      <Wrapper content>
        {/* 헤더 */}
        <Stack
          justify="space-between"
          align="center"
          gap="normal"
          className={styles.header}
        >
          <Button variant="invisible" icon="left" onClick={() => navigate(-1)}>
            &lt;
          </Button>
          <h1>회원정보 수정</h1>
        </Stack>

        {/* 기본 정보 */}
        <h2 className={styles.sectionTitle}>기본 정보</h2>
        <Stack direction="vertical" gap="normal" className={styles.formGroup}>
          <TextInput label="이름" placeholder="이름을 입력하세요" />
          <DateInput label="생년월일" placeholder="1900.01.01" />
        </Stack>

        {/* 라이프스타일 */}
        <h2 className={styles.sectionTitle}>라이프스타일</h2>
        <p className={styles.helpText}>
          나에게 맞는 추천 레시피와 식재료 큐레이션을 받을 수 있어요
        </p>
        <Stack direction="vertical" gap="normal" className={styles.formGroup}>
          <OptionsInput label="가구 형태">
            <option value="alone">자취생</option>
          </OptionsInput>
          <OptionsInput label="식사 스타일">
            <option value="one-meal">하루 한 끼만 먹는 편이에요</option>
          </OptionsInput>
          <OptionsInput label="요리 빈도">
            <option value="rare">가끔 요리해요 (주1-3회)</option>
          </OptionsInput>
          <OptionsInput label="장보기 스타일">
            <option value="bulk">한 번에 몰아서 장봐요</option>
          </OptionsInput>
        </Stack>

        {/* 요리 목적 */}
        <div className={styles.cookingPurpose}>
          <h3 className={styles.subTitle}>요리 목적</h3>
          <Stack wrap="wrap" gap="narrow" className={styles.buttonGroup}>
            {cookingPurposes.map((purpose) => (
              <Button
                key={purpose}
                variant="outlined"
                selected={selectedPurpose === purpose ? true : undefined}
                onClick={() => handlePurposeClick(purpose)}
              >
                {purpose}
              </Button>
            ))}
          </Stack>
        </div>
      </Wrapper>
      <Nav />
    </>
  );
}
