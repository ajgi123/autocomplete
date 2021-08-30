import styles from "./AutoComplete.module.css";
import useAutoComplete from "../../hooks/useAutoComplete";
import { ReactNode, useRef } from "react";
import { ArrayElement } from "../../helpers/ArrayElements";
import useKeyNavigation from "../../hooks/useKeyNavigation";
import { Action } from "../../hooks/useAsync";
import ClipLoader from "react-spinners/ClipLoader";
import { PromiseWithCancel } from "../../api/interfaces";
import { useEffect } from "react";

export type FetchDataType<T> = (query: string) => PromiseWithCancel<T>;
export type MapFuncType<T extends Object[]> = (
  index: number,
  selectedIndex: number | boolean,
  selectedRef: React.MutableRefObject<HTMLLIElement | null>,
  item: ArrayElement<T>
) => ReactNode;

type AutoCompletePropsType<T extends any[]> = {
  fetchData: FetchDataType<T>;
  minTextLength: number;
  mapFunc: MapFuncType<T>;
  enterhandler: (data: T | null, curIndex: number | boolean) => void;
};

const AutoComplete = <T extends any[]>(props: AutoCompletePropsType<T>) => {
  const {
    error,
    status,
    data,
    input,
    changeHandler,
    isShown,
    focusHandler,
    blurHandler,
  } = useAutoComplete(props.fetchData, props.minTextLength);
  const { cursor: curIndex, setCursor } = useKeyNavigation(
    data ? data.length - 1 : 0,
    enterHandler
  );
  const curItemRef = useRef<null | HTMLLIElement>(null);

  useEffect(() => {
    setCursor(false);
  }, [input, setCursor]);

  function enterHandler() {
    props.enterhandler(data, curIndex);
  }

  if (curItemRef.current) {
    curItemRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={input}
        onChange={changeHandler}
        onFocus={focusHandler}
        onBlur={blurHandler}
        className={styles.input}
      />
      {isShown && input.length >= props.minTextLength && (
        <div className={styles.dropdown} data-testid="autocomplete__dropdown">
          {status === Action.pending && (
            <ClipLoader data-testid="autocomplete__loading" />
          )}
          {status === Action.rejected && error.name === `AbortError` && (
            <ClipLoader />
          )}
          {data &&
            (data.length <= 0 ? (
              <p>No results</p>
            ) : (
              <ol className={styles.list}>
                {data.map((item, index) =>
                  props.mapFunc(index, curIndex, curItemRef, item)
                )}
              </ol>
            ))}
          {status === Action.rejected && error.name !== `AbortError` && (
            <p>Something went wrong</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
