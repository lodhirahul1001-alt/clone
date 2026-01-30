import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

/**
 * Reusable theme toggle.
 * Usage: <ThemeToggle className="..." />
 */
export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={
        "inline-flex items-center justify-center rounded-full border border-white/10 " +
        "bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 " +
        "backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.35)] " +
        "transition-colors duration-200 h-10 w-10 " +
        className
      }
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-white/90" />
      ) : (
        <Moon className="h-5 w-5 text-slate-900/80" />
      )}
    </button>
  );
}
