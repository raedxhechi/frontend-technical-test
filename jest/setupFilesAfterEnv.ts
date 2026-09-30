import "@testing-library/jest-dom"

if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
}

if (!Element.prototype.animate) {
  Element.prototype.animate = (() => ({
    cancel: () => {},
    finished: Promise.resolve(),
  })) as unknown as Element['animate']
}
