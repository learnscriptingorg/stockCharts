
export function normalizeValue(value, min, max, canvasMax, canvasMin) {
    return canvasMax - ((value - min) / (max - min)) * (canvasMax - canvasMin);
  }
  

  export function calculateVisibleRange(totalItems, maxItems, scrollOffset, zoomLevel) {
    const visibleItems = Math.min(totalItems, maxItems / zoomLevel);
    const startIndex = Math.max(0, Math.floor(scrollOffset * (totalItems - visibleItems)));
    const endIndex = Math.min(totalItems, startIndex + visibleItems);
    return { startIndex, endIndex };
  }