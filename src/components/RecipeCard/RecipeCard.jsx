import React from "react";

const RecipeCard = ({ name, time, serving }) => {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="font-semibold mb-1">{name}</h2>
      <p className="text-sm text-gray-600">{time}</p>
      <p className="text-sm text-gray-600">{serving}</p>
    </div>
  );
};

export default RecipeCard;
