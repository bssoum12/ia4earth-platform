interface Entry { count: number; resetAt: number }

export interface RateLimiter {
  check(key: string): { blocked: boolean; retryAfter: number };
  increment(key: string): void;
  clear(key: string): void;
}

export function createRateLimiter({
  max,
  windowMs,
}: {
  max: number;
  windowMs: number;
}): RateLimiter {
  const store = new Map<string, Entry>();

  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) store.delete(key);
    }
  }, Math.min(windowMs, 5 * 60 * 1000)).unref?.();

  return {
    check(key) {
      const now = Date.now();
      const entry = store.get(key);
      if (!entry || now > entry.resetAt) return { blocked: false, retryAfter: 0 };
      if (entry.count >= max) {
        return { blocked: true, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
      }
      return { blocked: false, retryAfter: 0 };
    },
    increment(key) {
      const now = Date.now();
      const entry = store.get(key);
      if (!entry || now > entry.resetAt) {
        store.set(key, { count: 1, resetAt: now + windowMs });
      } else {
        entry.count += 1;
      }
    },
    clear(key) {
      store.delete(key);
    },
  };
}
