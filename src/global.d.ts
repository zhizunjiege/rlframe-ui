declare global {
  type Modify<T, R> = Omit<T, keyof R> & R;

  type Nullable<T> = T | null;

  type Optional<T> = T | undefined;

  type PromiseType<T> = T extends Promise<infer R> ? R : T;
}

export {};
