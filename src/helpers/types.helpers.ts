/**
 * Custom type guard to verify if the value is different from undefined.
 * This allows to assert the type of elements being in an array populated by undefined or the actual element.
 * @param value - the value to check
 * @returns true if the value is not undefined
 *
 * ## Example
 * ```typescript
 * const john = { name: 'John' };
 * const charles = { name: 'Charles' };
 * const persons = [john, undefined, charles];
 *
 * persons.filter(Boolean).map((person) => person.name); // Type error: Object "person" is possibly 'undefined'.
 * persons.filter(isDefined).map((person) => person.name); // No type error.
 * ```
 */
export function isDefined<T>(value: T | undefined): value is T {
  return typeof value !== "undefined";
}

export function isTruthy<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined && typeof value !== "undefined";
}

export type NullOrUndef = null | undefined;

export type Maybe<T> = T | NullOrUndef;
