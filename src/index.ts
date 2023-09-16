export interface MiscMatchers<R> {
  toBeCalledWithContext<T>(expected: T): R;
  toHaveBeenCalledWithContext<T>(expected: T): R;
}

export * from "./context";
