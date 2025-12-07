import { useEffect } from "react";

export function useScroll(
  callback: (data: {
    scroll: number;
    limit: number;
    velocity: number;
    direction: number;
    progress: number;
  }) => void,
  deps: React.DependencyList = [],
) {
  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;
      const limit = document.documentElement.scrollHeight - window.innerHeight;
      const progress = limit > 0 ? scroll / limit : 0;

      callback({
        scroll,
        limit,
        velocity: 0, // simplified version
        direction: 0, // simplified version
        progress,
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [callback, ...deps]);
}
