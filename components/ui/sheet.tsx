"use client";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sheet({
  open, onClose, title, children, side = "right",
}: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; side?: "right" | "bottom";
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog" aria-modal="true" aria-label={title}
            className={cn(
              "fixed z-[95] bg-page flex flex-col",
              side === "right"
                ? "top-0 right-0 h-dvh w-full max-w-md border-l border-line"
                : "bottom-0 left-0 right-0 max-h-[88dvh] rounded-t-3xl border-t border-line"
            )}
            initial={side === "right" ? { x: "100%" } : { y: "100%" }}
            animate={side === "right" ? { x: 0 } : { y: 0 }}
            exit={side === "right" ? { x: "100%" } : { y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <h3 className="font-display text-xl">{title}</h3>
              <button onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-line/50 cursor-pointer">
                <X size={18} />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
