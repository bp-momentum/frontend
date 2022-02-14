import { useEffect, useState } from "react";
import debounce from "lodash/debounce";

function useWindowDimensions(delay = 100) {
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
}

export default useWindowDimensions;
