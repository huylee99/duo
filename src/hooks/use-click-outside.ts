import { RefObject, useEffect } from "react";

export const useClickOutside = (ref: RefObject<HTMLElement>, callback: () => void) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
        callback();
      }
    };

    // delay the subscription to click events to avoid triggering the callback on mount
    // fixed by Dan Abramov: https://github.com/facebook/react/issues/24657#issuecomment-1150119055
    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClick, false);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClick, false);
    };
  }, [callback, ref]);
};
