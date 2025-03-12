import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
 
const docsComponents = getDocsMDXComponents()
 
export function useMDXComponents(components) {
  const componentOrDefault = components || {};
  return {
    ...docsComponents,
    ...componentOrDefault
    // ... your additional components
  }
}