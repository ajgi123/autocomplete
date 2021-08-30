import { Dispatch, useCallback, useLayoutEffect, useRef } from "react";

const useSafeDispatch = <T extends Dispatch<any>>(dispatch: T) => {
  const mountedRef = useRef(false);

  useLayoutEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      mountedRef.current ? dispatch.call(null, ...args) : void 0;
    },
    [dispatch]
  );
};

export default useSafeDispatch;
