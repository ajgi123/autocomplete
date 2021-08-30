import { useCallback, useEffect, useState } from "react";

enum KeyEnums {
  ArrowUp = "ArrowUp",
  ArrowDown = "ArrowDown",
  Enter = "Enter",
}

const useKeyNavigation = (maxCursorIndex: number, enterHandler: () => void) => {
  const [cursor, setCursor] = useState<number | boolean>(false);

  const keyDownHandler = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === KeyEnums.ArrowDown) {
        setCursor((state) => {
          if (typeof state === "boolean") {
            return 0;
          }
          if (state >= maxCursorIndex) {
            return maxCursorIndex;
          }
          return state + 1;
        });
        return;
      }
      if (event.key === KeyEnums.ArrowUp) {
        setCursor((state) => {
          if (typeof state === "boolean") {
            return 0;
          }
          if (state <= 0) {
            return 0;
          }
          return state - 1;
        });
      }
      if (event.key === KeyEnums.Enter) {
        enterHandler();
      }
    },
    [maxCursorIndex, enterHandler]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [keyDownHandler]);

  return { cursor, setCursor };
};

export default useKeyNavigation;
