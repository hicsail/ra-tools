import { Embed, FilterItem, Range, Sort } from './types.js';
import { TransformFnParams } from 'class-transformer';

const eachElementIsType = (values: unknown[], type: string): boolean => {
  for (const value of values) {
    if (typeof value !== type) {
      return false;
    }
  }
  return true;
};

/**
 * Handles parsing a potential object.
 *
 * 1. If the value is already an object it is just returned
 * 2. If the value is a string, it is attempted to be treated
 *    as JSON
 * 3. If the value isn't a string or valid JSON it is just returned
 */
const unpack = (value: unknown): unknown => {
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

export const parseFilter = (params: TransformFnParams): FilterItem[] => {
  const value = params.value;

  // Disallow null values
  if (value === null || value === undefined) {
    throw new Error('Null/Undefined cannot be converted into sort');
  }

  const unpacked = unpack(value);

  if (unpacked === null) {
    throw new Error('Filter cannot be null');
  }

  // Needs to be an object and not an array
  if (typeof unpacked !== 'object' || Array.isArray(unpacked)) {
    throw new Error(`Filter needs to be an object`);
  }

  // Need to validate each sub field
  const result: FilterItem[] = [];
  for (const field in unpacked as any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const payload = (unpacked as any)[field] as unknown;

    // Payload cannot be an object
    if (typeof payload === 'object' && !Array.isArray(payload)) {
      throw new Error('Field of a filter must be an array or primitive');
    }

    // Can not have an undefined value
    if (payload === undefined) {
      throw new Error('Value of the field cannot be undefined');
    }

    // If the type is an array, make sure each element is valid
    const payloadType = typeof payload;
    if (Array.isArray(payload)) {
      if (!eachElementIsType(payload, 'string') && !eachElementIsType(payload, 'number')) {
        throw new Error('Each elemenet of a filter payload must be a string or number');
      }
    } else if (payloadType != 'number' && payloadType != 'string') {
      throw new Error("A field that isn't an array needs to be a string or number");
    }

    // TODO: In the future handle the sub-operation support

    result.push({
      field,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      value: payload as any
    });
  }

  return result;
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

export const parseEmbed = (params: TransformFnParams): Embed => {
  const value = params.value;

  // Disallow null values
  if (value === null) {
    throw new Error('Null/Undefined cannot be convereted into embed value');
  }

  // See if the value is stringified JSON
  const unpacked = unpack(value);

  // If the value is an array, and each element is a string, can return the value
  if (Array.isArray(unpacked) && eachElementIsType(unpacked, 'string')) {
    return unpacked as string[];
  }

  // If the value is a string, can return that value
  if (typeof unpacked === 'string') {
    return [unpacked];
  }

  // In all other cases it is invalid
  throw new Error(`Unknown embedding`);
};
