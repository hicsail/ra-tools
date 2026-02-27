/**
 * Type based on class-transformer with only the fields needed
 * for parsing
 */
export interface TransformFnParams {
  value: any;
  key: string;
  obj: any;
}

/**
 * Handles parsing a potential object.
 *
 * 1. If the value is already an object it is just returned
 * 2. If the value is a string, it is attempted to be treated
 *    as JSON
 * 3. If the value isn't a string or valid JSON it is just returned
 */
export const unpack = (value: unknown): unknown => {
  if (typeof value === 'object') {
    return value;
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (_e) {
      // At this point its a string that isn't stringifies JSON
      return value;
    }
  }

  return value;
};

/**
 * Verify each element of an array is of a matching type
 */
export const eachElementIsType = (values: unknown[], type: string): boolean => {
  for (const value of values) {
    if (typeof value !== type) {
      return false;
    }
  }
  return true;
};
