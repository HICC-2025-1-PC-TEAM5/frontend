import { Routes, Route } from 'react-router';
import Profile from './Profile';

export default () => {
  return (
    <Routes>
      <Route index element={<Profile />} />
    </Routes>
  );
};
