import { useEffect, useState } from 'react'
import type { ThemeSetting } from './storage'

export function useEffectiveTheme(setting: ThemeSetting): 'light' | 'dark' {
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystemDark(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  if (setting === 'system') return systemDark ? 'dark' : 'light'
  return setting
}

export const wakeLockSupported = () => typeof navigator !== 'undefined' && 'wakeLock' in navigator

/** Keeps the phone screen from dimming or locking mid-khutbah (where supported). */
export function useWakeLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled || !wakeLockSupported()) return
    let sentinel: WakeLockSentinel | null = null
    let cancelled = false
    const acquire = async () => {
      if (document.visibilityState !== 'visible' || (sentinel && !sentinel.released)) return
      try {
        sentinel = await navigator.wakeLock.request('screen')
        if (cancelled) void sentinel.release()
      } catch {
        // Denied (e.g. low battery mode); nothing else to do.
      }
    }
    void acquire()
    // The lock is dropped whenever the page is hidden, so re-acquire on return.
    document.addEventListener('visibilitychange', acquire)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', acquire)
      void sentinel?.release()
    }
  }, [enabled])
}
