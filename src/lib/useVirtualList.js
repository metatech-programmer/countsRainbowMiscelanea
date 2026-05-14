import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Windowed list rendering. Returns only items in the visible viewport
 * plus an overscan buffer, avoiding DOM nodes for off-screen rows.
 *
 * @param {object[]} items  - Full sorted array to virtualise
 * @param {number}   rowHeight - Fixed row height in px (must be consistent)
 * @param {number}   [overscan=5] - Extra rows above/below viewport
 */
export function useVirtualList(items, rowHeight, overscan = 5) {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(400);

  const onScroll = useCallback((e) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setViewportHeight(entry.contentRect.height);
    });
    ro.observe(el);
    setViewportHeight(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  const totalHeight = items.length * rowHeight;

  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + viewportHeight) / rowHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1).map((item, i) => ({
    item,
    index: startIndex + i,
    offsetTop: (startIndex + i) * rowHeight,
  }));

  const paddingTop = startIndex * rowHeight;
  const paddingBottom = Math.max(0, (items.length - 1 - endIndex) * rowHeight);

  return { containerRef, onScroll, visibleItems, totalHeight, paddingTop, paddingBottom };
}
