// Anything still waiting for the owner is written as a string starting with
// "TODO:". It is never shown as real copy in production.

export const TODO_PREFIX = "TODO:";

export function isTodo(value: unknown): value is string {
  return typeof value === "string" && value.trimStart().startsWith(TODO_PREFIX);
}
