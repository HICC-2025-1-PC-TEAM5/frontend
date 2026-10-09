# 오늘도 썩는 중 (CookIt) — Frontend

**식재료 사진·영수증을 인식해 냉장고를 관리하고, 냉장고 재료로 만들 수 있는 레시피를 추천하는 서비스**의 프론트엔드입니다.
HICC 2025 상반기 프로젝트 대회 출품작입니다. 모바일 화면(375px)을 기준으로 만들었습니다.

- 백엔드·서비스 전체 설명: [HICC-2025-1-PC-TEAM5/backend](https://github.com/HICC-2025-1-PC-TEAM5/backend)

## 화면

| 경로 | 화면 | 내용 |
|------|------|------|
| `/login`, `/start`, `/intro` | 로그인·소개 | Google 로그인. 로그인 후 refresh 쿠키로 세션을 복원 |
| `/` | 홈 | 인사, 냉장고 알림 카드(냉장고로 이동), 레시피 분류 바로가기 |
| `/fridge/*` | 냉장고 | 보관방식·분류별 재료 목록, 직접 추가, **사진·영수증 촬영 → 인식 결과 확인·수정 → 등록**, 수량 수정·삭제 |
| `/recipes` | 레시피 추천 | 냉장고 재료로 만들 수 있는 레시피 카드. 일치·부족 재료, 기한 지난 재료 안내, 대체 가능 재료 안내 |
| `/recipes/:recipeid` | 레시피 상세 | 재료·조리 단계·인분·열량, 저장, 조리 완료 시 사용한 재료를 골라 냉장고에서 삭제 |
| `/profile/*` | 프로필·설정 | 저장한 요리, 요리 취향(알레르기, 재료 좋아요/싫어요), 로그아웃 |

`/login` 계열을 뺀 모든 화면은 `RequireAuth`로 로그인이 필요합니다.

## 기술 스택

| 영역 | 사용 기술 |
|------|-----------|
| UI | React 19, CSS Modules (`master.css` 디자인 토큰), vite-plugin-svgr |
| 라우팅 | react-router 7 |
| HTTP | axios |
| 빌드·도구 | Vite 7, ESLint 9, Prettier 설정 |

## 프로젝트 구조

```
src/
├── main.jsx, App.jsx     # 라우터, UserProvider, SavedRecipesProvider
├── master.css            # 색·간격·글꼴 토큰
├── lib/                  # 서버 호출 계층
│   ├── api.js            # axios 인스턴스, access 토큰 보관, 401 → refresh 후 재시도
│   ├── auth.js  fridge.js  recipes.js  preference.js  favorites.js
│   └── userStorage.js    # localStorage 계정별 키
├── pages/                # Auth, Home, Fridge, Recipes, Profile + UserContext
├── components/           # 공용 UI (Button, Nav, Stack, Wrapper, TextInput …)
└── routes/RequireAuth.jsx
```

### 설계 규칙

- **서버 호출은 `lib/*.js`에서만** 합니다. 화면은 `lib` 함수를 부르고, 오류는 `toReadableError`가 상태 코드를 한글 메시지로 바꿔 화면에 보여 줍니다(`err.status` 유지).
- **토큰은 `lib/api.js`만 다룹니다.** access 토큰은 메모리에만 두고 `localStorage`에 저장하지 않습니다. 새로고침하면 `UserContext`가 HttpOnly refresh 쿠키로 세션을 다시 복원하고, 실패하면 로그인 화면으로 보냅니다.
- 401/419 응답에는 refresh를 한 번만 호출하고(동시에 여러 요청이 실패해도 1회) 원래 요청을 재시도합니다.
- 요청 타임아웃은 기본 10초, 사진·영수증 인식은 30초입니다.
- 보관방식·분류·좋아요/싫어요는 서버가 쓰는 한글 문자열(`실온`/`냉장실`/`냉동고` 등)로 보냅니다. 화면 내부 값은 전송 직전에 `lib/fridge.js`에서 바꿉니다.
- `localStorage`에는 계정별 캐시(`savedRecipes:{userId}`)와 서버에 없는 재료 단위 좋아요/싫어요(`ingredientPrefs:{userId}`)만 둡니다.

## 로컬 실행

백엔드가 먼저 떠 있어야 합니다([백엔드 실행 방법](https://github.com/HICC-2025-1-PC-TEAM5/backend#로컬-실행)).

1. `.env` 작성

   ```properties
   # 백엔드 주소
   VITE_API_BASE_URL=http://localhost:8080
   # 재료 이미지 경로 (생략 시 /files)
   VITE_IMAGE_BASE_PATH=/files
   ```

2. 설치·실행

   ```bash
   npm ci
   ```

   ```bash
   npm run dev
   ```

   http://localhost:5173 에서 열립니다. 로그인 후 백엔드가 `app.frontend.main-url`로 돌려보내므로, 백엔드 설정의 그 값이 이 주소와 같아야 합니다.

## 스크립트

| 명령 | 내용 |
|------|------|
| `npm run dev` | 개발 서버 (5173) |
| `npm run build` | 프로덕션 빌드 (`dist/`) |
| `npm run preview` | 빌드 결과 미리 보기 |
| `npm run lint` | ESLint |

테스트 러너는 없습니다. 변경 후에는 `npm run lint`, `npm run build`와 브라우저(모바일 375px) 동작으로 확인합니다.
