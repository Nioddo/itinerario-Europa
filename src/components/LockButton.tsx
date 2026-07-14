"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Modal, Field, inputClass, PrimaryButton, GhostButton, ErrorNote } from "./ui";

export function LockButton({ editor }: { editor: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "No se pudo validar el código.");
        return;
      }
      setOpen(false);
      setCode("");
      startTransition(() => router.refresh());
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  async function lock() {
    setLoading(true);
    try {
      await fetch("/api/auth", { method: "DELETE" });
      setOpen(false);
      startTransition(() => router.refresh());
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        aria-label={editor ? "Modo edición activo" : "Desbloquear edición"}
        className={
          "fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full text-2xl shadow-lg ring-1 backdrop-blur transition active:scale-95 " +
          (editor
            ? "bg-emerald-600 text-white ring-emerald-500/50 hover:bg-emerald-500"
            : "bg-white text-stone-700 ring-black/5 hover:bg-stone-50 dark:bg-stone-800 dark:text-stone-200 dark:ring-white/10")
        }
      >
        {editor ? "🔓" : "🔒"}
      </button>

      {open && (
        <Modal
          title={editor ? "Modo edición" : "Desbloquear edición"}
          onClose={() => setOpen(false)}
        >
          {editor ? (
            <div>
              <p className="mb-5 text-stone-600 dark:text-stone-400">
                El modo edición está activo en este dispositivo. Ya podés agregar,
                editar y eliminar actividades y propuestas.
              </p>
              <div className="flex gap-2">
                <GhostButton onClick={() => setOpen(false)} className="flex-1">
                  Seguir editando
                </GhostButton>
                <PrimaryButton onClick={lock} pending={loading}>
                  🔒 Bloquear
                </PrimaryButton>
              </div>
            </div>
          ) : (
            <form onSubmit={unlock}>
              <p className="mb-4 text-stone-600 dark:text-stone-400">
                Ingresá el código para habilitar la edición en este dispositivo.
              </p>
              <ErrorNote msg={error} />
              <Field label="Código">
                <input
                  autoFocus
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                  autoComplete="off"
                />
              </Field>
              <PrimaryButton type="submit" pending={loading}>
                Desbloquear
              </PrimaryButton>
            </form>
          )}
        </Modal>
      )}
    </>
  );
}
