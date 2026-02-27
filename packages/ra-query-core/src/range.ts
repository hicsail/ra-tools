import { unpack, eachElementIsType } from './utility';
import { TransformFnParams } from './utility';

/**
 * Numeric range describing which items to show
 */
export type Range = {
  start: number;
  end: number;
};

export const parseRange = (params: TransformFnParams): Range => {
  const value = params.value;

  // Disallow null values
  if (value === null || value === undefined) {
    throw new Error('Null/Undefined cannot be converted into range');
  }

  const unpacked = unpack(value);

  // Make sure the range is an array
  if (!Array.isArray(unpacked)) {
    throw new Error(`Range must be array`);
  }

  // Make sure each element is a number
  if (!eachElementIsType(unpacked, 'number')) {
    throw new Error(`Range must be array of numbers`);
  }

  // Handle different lengths
  if (unpacked.length > 2 || unpacked.length === 0) {
    throw new Error(`Range must be 1 or 2 elements in length`);
  }

  if (unpacked.length === 1) {
    return { start: 0, end: unpacked[0] as number };
  }

  const first = unpacked[0] as number;
  const second = unpacked[1] as number;

  if (first > second) {
    throw new Error('First element in range must be less than or equal to second');
  }

  return { start: first, end: second };
};

