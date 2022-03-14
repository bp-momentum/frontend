import { useEffect, useState } from "react";
import debounce from "lodash/debounce";

/**
 * Custom hook to get the window dimensions
 * @param {number} delay in ms to debounce the window resize event
 * @returns {{width: number, height: number}} width and height of the window
 */
const useWindowDimensions = (
  delay = 100
): { width: number; height: number } => {
  function getSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  const [windowSize, setWindowSize] = useState(getSize());

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(getSize());
    };
    const debouncedHandleResize = debounce(handleResize, delay);
    window.addEventListener("resize", debouncedHandleResize);
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, [delay]);

  return windowSize;
};

export default useWindowDimensions;
