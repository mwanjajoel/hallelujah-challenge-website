"use client";

import { useSyncExternalStore } from "react";

const KEY = "hc-theme";
const EVENT = "hc-themechange";

/**
 * Read from the DOM rather than from React state.
 *
 * An inline script in the document head has already set the attribute before
 * first paint, so the DOM is the source of truth by the time React hydrates.
 * Holding it in state as well would mean two places to disagree, and a flash
 * while they reconciled.
 */
function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

const isDark = () => document.documentElement.dataset.theme === "dark";
const lightOnServer = () => false;

export function setTheme(dark: boolean) {
  const root = document.documentElement;
  if (dark) root.dataset.theme = "dark";
  else delete root.dataset.theme;
  try {
    localStorage.setItem(KEY, dark ? "dark" : "light");
  } catch {
    /* private browsing; the choice simply will not persist */
  }
  window.dispatchEvent(new Event(EVENT));
}

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, lightOnServer);

  return (
    <button
      type="button"
      onClick={() => setTheme(!dark)}
      aria-pressed={dark}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
      className="hc-t hc-circle"
      style={{
        flex: "none",
        width: 42,
        height: 42,
        display: "inline-grid",
        placeItems: "center",
        borderRadius: "var(--r-pill)",
        border: "1px solid var(--line)",
        background: "transparent",
        color: "var(--fg)",
        cursor: "pointer",
      }}
    >
      {/* Rendered from the same markup in both states so there is nothing to
          swap on hydration — only the paths differ. */}
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {dark ? (
          <path
            d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        ) : (
          <>
            <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M12 2.4v2.2M12 19.4v2.2M4.4 12H2.2M21.8 12h-2.2M6.6 6.6 5 5M19 19l-1.6-1.6M17.4 6.6 19 5M5 19l1.6-1.6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    </button>
  );
}
