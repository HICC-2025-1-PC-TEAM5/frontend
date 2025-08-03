import { Routes, Route } from 'react-router';
import ProfileSetting from './ProfileSetting';

export default () => {
  return (
    <Routes>
      <Route index element={<ProfileSetting />} />
    </Routes>
  );
};
