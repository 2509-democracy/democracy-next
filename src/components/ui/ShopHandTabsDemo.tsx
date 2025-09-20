import React, { useState } from "react";
import { TechCard as TechCardComponent } from "./TechCard";

const demoShop = [
  {
    id: "react",
    name: "React",
    category: "Frontend",
    cost: 2,
    level: 1,
    difficulty: 2,
    popularity: 3,
    performance: 2,
  },
  {
    id: "express",
    name: "Express",
    category: "Backend",
    cost: 1,
    level: 1,
    difficulty: 1,
    popularity: 3,
    performance: 2,
  },
];
const demoHand = [
  {
    id: "vue",
    name: "Vue.js",
    category: "Frontend",
    cost: 1,
    level: 1,
    difficulty: 1,
    popularity: 2,
    performance: 2,
  },
];

export function ShopHandTabsDemo() {
  const [activeTab] = useState<"shop" | "hand">("shop");
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-2">
        <button
          type="button"
          className={`px-3 py-1 text-xs font-medium rounded transition-colors pointer-events-none ${
            activeTab === "shop"
              ? "bg-cyan-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          ショップ
        </button>
        <button
          type="button"
          className={`px-3 py-1 text-xs font-medium rounded transition-colors pointer-events-none ${
            activeTab === "hand"
              ? "bg-orange-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          手札
        </button>
        <span className="text-xs text-gray-500">
          {activeTab === "shop" ? "ショップ" : "手札"}を選択中
        </span>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {activeTab === "shop"
          ? demoShop.map((card) => (
              <TechCardComponent key={card.id} card={card} />
            ))
          : demoHand.map((card) => (
              <TechCardComponent key={card.id} card={card} />
            ))}
      </div>
    </div>
  );
}
