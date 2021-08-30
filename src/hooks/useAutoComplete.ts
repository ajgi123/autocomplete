import { useEffect, useState, useRef } from "react";
import useAsync from "./useAsync";
import { PromiseWithCancel } from "../api/interfaces";

const useAutoComplete = <T extends any[]>(
  fetchData: (query: string) => PromiseWithCancel<T>,
  minTextLength = 0
) => {
  const initialState = new Array<any>() as T;
  const { error, status, data, runAsync } = useAsync<T>(initialState);
  const [input, setInput] = useState("");
  const [isShown, setIsShown] = useState(false);
  const curPromise = useRef<PromiseWithCancel<T> | undefined>(undefined);

  useEffect(() => {
    if (input.length >= minTextLength) {
      runAsync(
        (function () {
          const query = fetchData(input);
          curPromise.current = query;
          return query;
        })()
      );
    }

    return () => {
      if (curPromise.current) {
        curPromise.current.cancel();
      }
    };
  }, [input, runAsync, fetchData, minTextLength]);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const focusHandler = () => {
    setIsShown(true);
  };

  const blurHandler = () => {
    setIsShown(false);
  };

  return {
    error,
    status,
    data,
    setInput,
    input,
    changeHandler,
    blurHandler,
    focusHandler,
    isShown,
    setIsShown,
  };
};

export default useAutoComplete;
