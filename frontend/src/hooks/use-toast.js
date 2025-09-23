"use client";

import { toast as sonnerToast } from "sonner";

/**
 * Global toast hook with custom variants
 *
 * Usage:
 * const { toast } = useToast();
 * toast.success("Done!");
 */
export function useToast() {
  const toast = Object.assign(sonnerToast, {
    success: (message, options) =>
      sonnerToast(message, {
        ...options,
        style: { backgroundColor: "#22c55e", color: "#fff" }, // green
        icon: "✅",
      }),
    error: (message, options) =>
      sonnerToast(message, {
        ...options,
        style: { backgroundColor: "#ef4444", color: "#fff" }, // red
        icon: "❌",
      }),
    info: (message, options) =>
      sonnerToast(message, {
        ...options,
        style: { backgroundColor: "#3b82f6", color: "#fff" }, // blue
        icon: "ℹ️",
      }),
    warning: (message, options) =>
      sonnerToast(message, {
        ...options,
        style: { backgroundColor: "#f59e0b", color: "#fff" }, // yellow
        icon: "⚠️",
      }),
  });

  return { toast };
}
