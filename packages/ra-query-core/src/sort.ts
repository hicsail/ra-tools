import { TransformFnParams } from 'class-transformer';
import { unpack, eachElementIsType } from './utility';

/**
 * Direction to sort in
 */
export type SortDirection = 'ASC' | 'DESC';

/**
 * Information about the field to use for sorting
 */
export type Sort = {
  field: string;
  direction: SortDirection;
};

export const parseSort = (params: TransformFnParams): Sort => {
  const value = params.value;

  // Disallow null values
  if (value === null || value === undefined) {
    throw new Error('Null/Undefined cannot be converted into sort');
  }

  const unpacked = unpack(value);

  // Make sure the sort field is an array
  if (!Array.isArray(unpacked)) {
    throw new Error(`Sort must be array`);
  }

  // Make sure each element is a string
  if (!eachElementIsType(unpacked, 'string')) {
    throw new Error(`Sort must be array of string`);
  }

  // Make sure the length is 2
  if (unpacked.length !== 2) {
    throw new Error('Sort must contain a field and a direction');
  }

  const field = unpacked[0] as string;
  const direction = unpacked[1] as string;

  if (direction !== 'ASC' && direction !== 'DESC') {
    throw new Error(`Direction must be either asc or desc`);
  }

  return {
    field,
    direction
  };
};
