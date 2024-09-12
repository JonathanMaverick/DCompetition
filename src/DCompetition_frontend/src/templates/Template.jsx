import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import Nav from "../components/Nav";

export default function Template({ children }) {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div
      className={`${theme} min-h-screen flex flex-col text-foreground bg-background`}
    >
      <Nav></Nav>
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* <button
            className="fixed bottom-2 right-5 z-10 px-2 py-2 mb-4 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-full"
            onClick={toggleTheme}
          >
            {theme === "light" ? (
              <FaMoon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
            ) : (
              <FaSun className="h-5 w-5 text-white" />
            )}
          </button> */}
          {children}
        </div>
      </div>
    </div>
  );
}
