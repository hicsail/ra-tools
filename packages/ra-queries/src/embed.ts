import { TransformFnParams } from 'class-transformer';
import { unpack, eachElementIsType } from './utility';

export type Embed = string[];

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
