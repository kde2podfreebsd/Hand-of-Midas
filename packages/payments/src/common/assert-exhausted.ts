/** Switch-case typecheck. Compile error if not all cases used */
export const assertExhausted = (value: never): never => {
  throw new Error(`Unknown switch-case value ${value as string}`);
};
