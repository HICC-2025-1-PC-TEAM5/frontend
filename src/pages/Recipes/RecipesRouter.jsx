import { Routes, Route } from 'react-router';
import Recipes from './Recipes';
import Recipe from './Recipe/Recipe';

export default () => {
  return (
    <Routes>
      <Route index element={<Recipes />} />
      <Route path=":id" element={<Recipe />} />
    </Routes>
  );
};
