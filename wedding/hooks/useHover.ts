import React from 'react';

export function useHover<T extends HTMLElement>(): [
  React.MutableRefObject<T | null>,
  boolean
] {
  const [value, setValue] = React.useState(false);
  const ref = React.useRef<T | null>(null);
  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);
  React.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);
      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      };
    }
  }, []);
  return [ref, value];
}
