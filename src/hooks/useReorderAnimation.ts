import { useLayoutEffect, useRef } from 'react'
import type { RefObject } from 'react'

const DURATION_MS = 250

export function useReorderAnimation(containerRef: RefObject<HTMLElement | null>) {
  const previousTops = useRef(new Map<string, number>())
  const runningAnimations = useRef(new Map<string, Animation>())

  useLayoutEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    container.querySelectorAll<HTMLElement>('[data-animate-key]').forEach((item) => {
      const key = item.dataset.animateKey

      if (key === undefined) {
        return
      }

      const top = item.offsetTop
      const previousTop = previousTops.current.get(key)

      previousTops.current.set(key, top)

      if (previousTop === undefined || previousTop === top || prefersReducedMotion) {
        return
      }

      runningAnimations.current.get(key)?.cancel()

      runningAnimations.current.set(
        key,
        item.animate(
          [
            { transform: `translateY(${previousTop - top}px)` },
            { transform: 'translateY(0)' },
          ],
          { duration: DURATION_MS, easing: 'ease-out' },
        ),
      )
    })
  })
}
