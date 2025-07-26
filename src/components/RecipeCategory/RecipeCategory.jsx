import React from "react";

import { ReactComponent as HansikBlack } from "../../assets/svg/hansik_black.svg";
import { ReactComponent as HansikGray } from "../../assets/svg/hansik_gray.svg";
import { ReactComponent as JungsikBlack } from "../../assets/svg/jungsik_black.svg";
import { ReactComponent as JungsikGray } from "../../assets/svg/jungsik_gray.svg";
import { ReactComponent as IlsikBlack } from "../../assets/svg/ilsik_black.svg";
import { ReactComponent as IlsikGray } from "../../assets/svg/ilsik_gray.svg";

const RecipeCategory = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const getIcon = (label, isSelected) => {
    switch (label) {
      case "한식":
        return isSelected ? (
          <HansikBlack className="w-6 h-6" />
        ) : (
          <HansikGray className="w-6 h-6" />
        );
      case "중식":
        return isSelected ? (
          <JungsikBlack className="w-6 h-6" />
        ) : (
          <JungsikGray className="w-6 h-6" />
        );
      case "일식":
        return isSelected ? (
          <IlsikBlack className="w-6 h-6" />
        ) : (
          <IlsikGray className="w-6 h-6" />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex space-x-4 mb-6">
      {categories.map((label) => {
        const isSelected = selectedCategory === label;
        return (
          <button
            key={label}
            onClick={() => setSelectedCategory(label)}
            className="flex flex-col items-center px-2"
          >
            {getIcon(label, isSelected)}
            <span
              className={`text-sm mt-1 ${
                isSelected ? "text-black font-semibold" : "text-gray-400"
              }`}
            >
              {label}
            </span>
            {isSelected && <div className="w-4 h-0.5 bg-black mt-1"></div>}
          </button>
        );
      })}
    </div>
  );
};

export default RecipeCategory;
