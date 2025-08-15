import { Routes, Route } from 'react-router';
import Recipes from './Recipes';
import Recipe from './Recipe/Recipe';

export default function RecipesRouter() {
  return (
    <Routes>
      <Route index element={<Recipes />} />
      <Route path=":recipeid" element={<Recipe />} />
    </Routes>
  );
}
