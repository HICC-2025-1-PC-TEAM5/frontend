import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/Home/Home';
import Intro from './pages/Home/Intro';
import AuthStart from './pages/Auth/AuthStart';
import AuthLogin from './pages/Auth/AuthLogin';
import RecipesRouter from './pages/Recipes/RecipesRouter';
import FridgeRouter from './pages/Fridge/FridgeRouter';
import ProfileRouter from './pages/Profile/ProfileRouter';
import AuthCallback from './pages/Auth/AuthCallback';

import style from './App.module.css';
import ComponentsTest from './components/ComponentsTest';

// 레시피 저장 컨텍스트
import { SavedRecipesProvider } from './pages/Recipes/SavedRecipesContext';
// ✅ 라우트 가드
import RequireAuth from './routes/RequireAuth';

/*

/ >> 메인

/start >> 시작하기 (회원가입)
/login >> 로그인 

/recipes >> 레시피 목록 (전체 카테고리)
/recipes?category="카테고리" >> 특정 카테고리의 레시피 목록
/recipes?search="검색어" >> 검색한 레시피 목록
/recipes/:rid >> 특정 레시피 (인분 선택)
/recipes/:rid/cooking >> 레시피 조리 과정 (조리 시작)
/recipes/:rid/complete >> 조리 완료 후 사용된 제료 삭제

/fridge >> 냉장고, 재료들을 보여줌
/fridge/ingredients/:iid
/fridge/add >> 재료 추가 방법 선택
/fridge/add/form >> 재료 추가 (직접 입력)
/fridge/add/camera >> 재료 추가 (카메라, 재료 직접 촬영)
/fridge/add/camera-receipt >> 재료 추가 (카메라, 영수증, 바코드 촬영)

/profile >> 마이페이지

/settings/profile >> 마이페이지 설정

*/

export default () => {
  return (
    <div className={style.field}>
      <div className={style.app} dem="demo">
        <div className={style.topMargin}></div>
        <div className={style.wrapper}>
          <SavedRecipesProvider>
            <BrowserRouter>
              <Routes>
                {/* ✅ 공개 라우트 */}
                <Route path="login" element={<AuthLogin />} />
                <Route path="start" element={<AuthStart />} />
                <Route path="intro" element={<Intro />} />

                {/* ✅ 보호 라우트 */}
                <Route
                  index
                  element={
                    <RequireAuth>
                      <Home />
                    </RequireAuth>
                  }
                />
                <Route path="auth/callback" element={<AuthCallback />} />
                <Route
                  path="recipes/*"
                  element={
                    <RequireAuth>
                      <RecipesRouter />
                    </RequireAuth>
                  }
                />
                <Route
                  path="fridge/*"
                  element={
                    <RequireAuth>
                      <FridgeRouter />
                    </RequireAuth>
                  }
                />
                <Route
                  path="profile/*"
                  element={
                    <RequireAuth>
                      <ProfileRouter />
                    </RequireAuth>
                  }
                />

                {/* 필요 시 공개 테스트 페이지 (원하면 가드로 감싸도 됨) */}
                <Route path="test/components" element={<ComponentsTest />} />

                {/* 그 외는 홈으로 유도(보호) */}
                <Route
                  path="*"
                  element={
                    <RequireAuth>
                      <Home />
                    </RequireAuth>
                  }
                />
              </Routes>
            </BrowserRouter>
          </SavedRecipesProvider>
        </div>
        <div className={style.bottomMargin}></div>
      </div>
    </div>
  );
};
