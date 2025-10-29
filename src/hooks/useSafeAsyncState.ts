import {
  type MutableRefObject,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

/**
 * React Native friendly state hook that ignores updates once the component unmounts.
 * Prevents noise warnings from async callbacks resolving after unmount.
 */
export function useSafeAsyncState<T>(
  initial: T,
): [T, Dispatch<SetStateAction<T>>] {
  const isMounted = useRef(true);
  const [state, setState] = useState<T>(initial);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const safeSetState: Dispatch<SetStateAction<T>> = useCallback((value) => {
    if (isMounted.current) {
      setState(value);
    }
  }, []);

  return [state, safeSetState];
}

export function useMountedRef(): MutableRefObject<boolean> {
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return isMounted;
}
