"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const ToastContext = createContext(null);

export function useToasts() {
  return useContext(ToastContext);
}

function parseFlashCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )flash=([^;]+)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch (err) {
    return null;
  }
}

function clearFlashCookie() {
  document.cookie = `flash=; Path=/; Expires=${new Date(0).toUTCString()}`;
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function onToast(e) {
      const { type = "info", message = "" } = e.detail || {};
      const id = Date.now() + Math.random();
      setToasts((s) => [...s, { id, type, message }]);
      setTimeout(() => {
        setToasts((s) => s.filter((t) => t.id !== id));
      }, 4000);
    }

    // Listen for global toast events
    window.addEventListener("toast", onToast);

    // Check for server-set flash cookie (e.g., after login)
    const flash = parseFlashCookie();
    if (flash && flash.message) {
      window.dispatchEvent(new CustomEvent("toast", { detail: flash }));
      clearFlashCookie();
    }

    return () => window.removeEventListener("toast", onToast);
  }, []);

  const addToast = (payload) => {
    window.dispatchEvent(new CustomEvent("toast", { detail: payload }));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast container */}
      <div className='fixed right-4 bottom-6 z-50 flex flex-col gap-3'>
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-sm w-full px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-out border select-none ${
              t.type === "success"
                ? "bg-emerald-500 text-slate-900 border-emerald-600"
                : t.type === "error"
                  ? "bg-rose-600 text-white border-rose-700"
                  : "border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            }`}>
            <div className='flex items-start gap-3'>
              <div className='flex-1 text-sm font-medium'>{t.message}</div>
              <button
                onClick={() => setToasts((s) => s.filter((x) => x.id !== t.id))}
                className='text-xs opacity-80'>
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
