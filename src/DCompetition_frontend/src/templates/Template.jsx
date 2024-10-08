import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import Nav from "../components/Nav";
import ParticlesBackground from "../components/ParticlesBackground";
import { Toaster } from "react-hot-toast";

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
      className={`dark min-h-screen flex flex-col text-foreground bg-fixed bg-gradient-to-b from-black to-purple-900 bg-[length:100%_300vh]`}
    >
      <Toaster />
      <Nav></Nav>
      <ParticlesBackground />
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
