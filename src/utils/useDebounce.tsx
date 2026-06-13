import {useRef, useEffect} from 'react';

// Debounce function
const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Custom hook to use debounce
export const useDebounce = (func: (...args: any[]) => void, wait: number) => {
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunc = (...args: any[]) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => {
      func(...args);
    }, wait);
  };

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return debouncedFunc;
};
