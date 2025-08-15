import style from './App.module.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 페이지 임포트
import Home from './pages/Home/Home';
import Intro from './pages/Home/Intro';
import AuthStart from './pages/Auth/AuthStart';
import AuthLogin from './pages/Auth/AuthLogin';
import RecipesRouter from './pages/Recipes/RecipesRouter';
import FridgeRouter from './pages/Fridge/FridgeRouter';
import ProfileRouter from './pages/Profile/ProfileRouter';
import ComponentsTest from './components/ComponentsTest';

// 컨텍스트
import { SavedRecipesProvider } from './pages/Recipes/SavedRecipesContext';
import { UserProvider } from './pages/UserContext';
import RequireAuth from './routes/RequireAuth';

export default function App() {
  return (
    <div className={style.field}>
      <div className={style.app} dem="demo">
        <div className={style.topMargin}></div>
        <div className={style.wrapper}>
          <SavedRecipesProvider>
            <UserProvider>
              <BrowserRouter>
                <Routes>
                  {/* 공개 라우트 */}
                  <Route path="login" element={<AuthLogin />} />
                  <Route path="start" element={<AuthStart />} />
                  <Route path="intro" element={<Intro />} />

                  {/* 보호 라우트 */}
                  <Route
                    index
                    element={
                      <RequireAuth>
                        <Home />
                      </RequireAuth>
                    }
                  />
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

                  {/* 테스트 페이지 */}
                  <Route path="test/components" element={<ComponentsTest />} />

                  {/* 그 외 경로 → 홈 (보호) */}
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
            </UserProvider>
          </SavedRecipesProvider>
        </div>
        <div className={style.bottomMargin}></div>
      </div>
    </div>
  );
}