import { Reducer, useCallback, useReducer } from "react";
import useSafeDispatch from "./useSafeDispatch";

export enum Action {
  pending = "pending",
  resolved = "resolved",
  rejected = "rejected",
}

enum Idle {
  idle = "idle",
}

export type Status = Action | Idle;

type ActionType<T> =
  | {
      type: Action.pending;
    }
  | {
      type: Action.resolved;
      data: T;
    }
  | {
      type: Action.rejected;
      error: any;
    };

type StateType<T> = {
  data: T | null;
  status: Status;
  error: any | null;
};

function asyncReducer<T>(
  prevstate: StateType<T>,
  action: ActionType<T>
): StateType<T> {
  switch (action.type) {
    case Action.pending: {
      return { status: Action.pending, data: null, error: null };
    }
    case Action.resolved: {
      return { status: Action.resolved, data: action.data, error: null };
    }
    case Action.rejected: {
      return { status: Action.rejected, data: null, error: action.error };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
}

const useAsync = <T>(initialState: T) => {
  const [state, unSafeDispatch] = useReducer<
    Reducer<StateType<T>, ActionType<T>>
  >(asyncReducer, {
    status: Idle.idle,
    data: initialState,
    error: null,
  });

  const dispatch = useSafeDispatch(unSafeDispatch);

  const { data, error, status } = state;

  const runAsync = useCallback(
    (promise: Promise<T>) => {
      dispatch({ type: Action.pending });
      promise.then(
        (data) => {
          dispatch({ type: Action.resolved, data });
        },
        (error) => {
          dispatch({ type: Action.rejected, error });
        }
      );
    },
    [dispatch]
  );

  const setState = useCallback(
    (data: T) => {
      dispatch({ type: Action.resolved, data });
    },
    [dispatch]
  );

  const setError = useCallback(
    (error) => {
      dispatch({ type: Action.rejected, error });
    },
    [dispatch]
  );

  return {
    error,
    status,
    data,
    runAsync,
    setState,
    setError,
  };
};

export default useAsync;
