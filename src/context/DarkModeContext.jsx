import PropTypes from "prop-types";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { createContext, useContext, useEffect } from "react";

const DarkModeContext = createContext();
function DarkModeProvider({ children }) {
  const [isDarkMode, setDarkMode] = useLocalStorageState(
    window.matchMedia("(preferes-color-scheme: dark)").matches,
    "isDarkMode"
  );

  function toggleDarkMode() {
    setDarkMode((isDark) => !isDark);
  }

  DarkModeProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  useEffect(
    function () {
      if (isDarkMode) {
        document.documentElement.classList.add("dark-mode");
        document.documentElement.classList.remove("light-mode");
      } else {
        document.documentElement.classList.remove("dark-mode");
        document.documentElement.classList.add("light-mode");
      }
    },
    [isDarkMode]
  );
  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) throw new Error("Dark mode error");
  return context;
}

export { DarkModeProvider, useDarkMode };
