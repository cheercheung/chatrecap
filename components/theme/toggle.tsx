"use client";

import { BsMoonStars, BsSun } from "react-icons/bs";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  // 初始化主题
  useEffect(() => {
    // 检查localStorage中是否有保存的主题
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    // 应用主题到document
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleThemeChange = function (_theme: string) {
    if (_theme === theme) {
      return;
    }

    // 保存主题到localStorage
    localStorage.setItem("theme", _theme);
    setTheme(_theme);

    // 应用主题到document
    if (_theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="flex items-center gap-x-2 px-2">
      {theme === "dark" ? (
        <BsSun
          className="cursor-pointer text-lg text-muted-foreground"
          onClick={() => handleThemeChange("light")}
          width={80}
          height={20}
        />
      ) : (
        <BsMoonStars
          className="cursor-pointer text-lg text-muted-foreground"
          onClick={() => handleThemeChange("dark")}
          width={80}
          height={20}
        />
      )}
    </div>
  );
}
