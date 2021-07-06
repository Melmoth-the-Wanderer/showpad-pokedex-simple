export function getViewportWidth(): number {
  return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
}
