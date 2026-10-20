"use client";

import { useSyncExternalStore } from "react";
import { sessionModeFromLocation, type SessionMode } from "./session";

/**
 * A once-a-second clock, exposed as an external store.
 *
 * The server snapshot is null, and so is the first client snapshot, so the
 * server HTML and the hydrating render agree. The real time arrives on the
 * first tick, which is what keeps the countdowns free of hydration mismatches.
 */
let current: number | null = null;
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (!timer) {
    current = Date.now();
    timer = setInterval(() => {
      current = Date.now();
      for (const l of listeners) l();
    }, 1000);
  }
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

const getSnapshot = () => current;
const getServerSnapshot = (): number | null => null;

/** Current epoch milliseconds, or null until the clock has started. */
export function useNow(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const noopSubscribe = () => () => {};
const serverMode = (): SessionMode => "auto";

/** The `?session=` override, read from the URL once the page is interactive. */
export function useSessionMode(): SessionMode {
  return useSyncExternalStore(noopSubscribe, sessionModeFromLocation, serverMode);
}
