import { useEffect, useLayoutEffect } from 'react'

/**
 * Isomorphic layout effect hook.
 * @public
 */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect