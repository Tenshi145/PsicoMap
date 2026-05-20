import '@testing-library/jest-dom'

// Node v26 exposes an experimental localStorage that is undefined (requires --localstorage-file).
// Ensure a working localStorage is available for tests that use zustand/persist.
if (typeof localStorage === 'undefined' || localStorage === null) {
  const storage: Record<string, string> = {}
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key: string) => storage[key] ?? null,
      setItem: (key: string, value: string) => { storage[key] = value },
      removeItem: (key: string) => { delete storage[key] },
      clear: () => { for (const k in storage) delete storage[k] },
      get length() { return Object.keys(storage).length },
      key: (index: number) => Object.keys(storage)[index] ?? null,
    },
    writable: true,
  })
}
