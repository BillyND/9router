"use client";

import { useState, useCallback, useRef } from "react";

/**
 * Hook for copy to clipboard with feedback
 * @param {number} resetDelay - Time in ms before resetting copied state (default: 2000)
 * @returns {{ copied: string|null, copy: (text: string, id?: string) => void }}
 */
export function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(null);
  const timeoutRef = useRef(null);

  const copy = useCallback(async (text, id = "default") => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(id);
    } catch (err) {
      console.error("Failed to copy:", err);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setCopied(null);
    }, resetDelay);
  }, [resetDelay]);

  return { copied, copy };
}

