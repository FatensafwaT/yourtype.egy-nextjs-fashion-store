"use client";

import { useToastStore } from "@/store/toast";

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  return (
    <div className="fixed right-4 top-20 z-[999] flex w-[320px] flex-col gap-2">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => remove(t.id)}
          className={[
            "rounded-2xl border bg-white p-3 text-left shadow-sm transition hover:shadow-md",
            t.type === "success" ? "border-pink-200" : "border-gray-200",
          ].join(" ")}
        >
          <p className="text-sm font-medium">
            {t.type === "success" ? "✅ " : "ℹ️ "}
            {t.message}
          </p>
          
        </button>
      ))}
    </div>
  );
}
