import { useEffect, useRef, useState } from "react";

const handleMediaQueryChange = (matchQuery: MediaQueryList, handleChange: (this: MediaQueryList, e: MediaQueryListEvent) => void) => {
  try {
    matchQuery.addEventListener("change", handleChange);

    return () => {
      matchQuery.removeEventListener("change", handleChange);
    };

    //support safari below version 14
  } catch {
    matchQuery.addListener(handleChange);

    return () => {
      matchQuery.removeListener(handleChange);
    };
  }
};

// in case of SSR
const getMatches = (query: string): boolean => {
  if (typeof window !== "undefined") {
    return window.matchMedia(query).matches;
  }
  return false;
};

// ref: https://github.com/mantinedev/mantine/blob/master/src/mantine-hooks/src/use-media-query/use-media-query.ts

const useMediaQuery = (query: string, initialValue?: boolean) => {
  const [matches, setMatches] = useState(initialValue ? initialValue : () => getMatches(query));
  const queryRef = useRef<MediaQueryList>();

  useEffect(() => {
    queryRef.current = window.matchMedia(query);

    function handleChange(this: MediaQueryList, e: MediaQueryListEvent) {
      setMatches(e.matches);
    }

    handleMediaQueryChange(queryRef.current, handleChange);
  }, [query]);
  return matches;
};

export default useMediaQuery;
