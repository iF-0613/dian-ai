import { useEffect, useRef } from 'react';

export function useAutoScroll(dependency) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [dependency]);

  return scrollRef;
}
