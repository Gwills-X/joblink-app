"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type='button'
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className='inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-emerald-300 hover:text-emerald-700 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:shadow-none dark:hover:border-emerald-500/30 dark:hover:text-emerald-300'>
      {isLight ? <Moon className='h-4 w-4' /> : <Sun className='h-4 w-4' />}
    </button>
  );
}
