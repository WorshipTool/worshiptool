export type FunctionProps<T> = T extends (...args: infer P) => any ? P : never
