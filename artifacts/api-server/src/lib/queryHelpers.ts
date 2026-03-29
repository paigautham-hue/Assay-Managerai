/**
 * Safely extract a single string from Express query/header/params values.
 * Express 5 types req.query values as `string | ParsedQs | (string | ParsedQs)[] | undefined`
 * and req.params values as `string | string[]`.
 * This helper normalizes to `string | undefined`.
 */
export function qstr(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return qstr(value[0]);
  if (typeof value === 'object') return undefined;
  return String(value);
}
