import React, { useState } from "react";
import RecipeCategory from "../../components/RecipeCategory/RecipeCategory";
import RecipeCard from "../../components/RecipeCard/RecipeCard";

const Recipe = () => {
  const categories = ["한식", "중식", "일식"];
  const [selectedCategory, setSelectedCategory] = useState("한식");

  const recipes = [
    {
      id: 1,
      name: "김치찌개",
      time: "30분",
      serving: "2인분",
      category: "한식",
    },
    {
      id: 2,
      name: "된장국",
      time: "20분",
      serving: "1~2인분",
      category: "한식",
    },
    { id: 3, name: "짜장면", time: "25분", serving: "1인분", category: "중식" },
    { id: 4, name: "초밥", time: "15분", serving: "1~2인분", category: "일식" },
  ];

  const filteredRecipes = recipes.filter(
    (recipe) => recipe.category === selectedCategory
  );

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">이 요리들 어떤가요</h1>

      <RecipeCategory
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="grid grid-cols-2 gap-4">
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            name={recipe.name}
            time={recipe.time}
            serving={recipe.serving}
          />
        ))}
      </div>
    </div>
  );
};

export default Recipe;
