"use client";

import { useEffect, useState } from "react";

/** Botón flotante para alternar claro/oscuro. Persiste la elección en localStorage. */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // El estado inicial lo define el script inline del layout; acá solo lo leemos.
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* almacenamiento no disponible */
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={dark ? "Modo claro" : "Modo oscuro"}
      className="fixed bottom-[5.5rem] right-5 z-40 grid h-11 w-11 place-items-center rounded-full bg-white text-lg text-stone-700 shadow-lg ring-1 ring-black/5 backdrop-blur transition hover:bg-stone-50 active:scale-95 dark:bg-stone-800 dark:text-stone-200 dark:ring-white/10 dark:hover:bg-stone-700"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
