import { useEffect, useLayoutEffect } from 'react'

/**
 * Use `useIsomorphicLayoutEffect` to run layout effects in both the server and the client.
 * 
 * This hook runs `useLayoutEffect` on the client and `useEffect` on the server.
 * @public
 */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect