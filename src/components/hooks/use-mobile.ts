import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(
  { breakpoint } = { breakpoint: MOBILE_BREAKPOINT },
) {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0;

    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const checkMobile = () => {
      setIsMobile(isTouchDevice || window.innerWidth < breakpoint);
    };

    mql.addEventListener("change", checkMobile);
    checkMobile();

    return () => mql.removeEventListener("change", checkMobile);
  }, [breakpoint]);

  return !!isMobile;
}
