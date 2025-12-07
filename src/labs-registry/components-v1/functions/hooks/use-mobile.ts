import * as React from "react";

interface UseIsMobileOptions {
  breakpoint?: number;
}

export function useIsMobile(options?: UseIsMobileOptions) {
  const breakpoint = options?.breakpoint ?? 768;
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const onChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };

    // Set initial value
    onChange(mql);

    // Listen for changes
    mql.addEventListener("change", onChange);

    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return !!isMobile;
}
