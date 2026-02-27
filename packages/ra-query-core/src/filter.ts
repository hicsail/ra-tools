import { unpack, eachElementIsType } from './utility';
import { TransformFnParams } from './utility';

export type FilterOperations = 'eq' | 'neq' | 'eq_any' | 'neq_any' | 'inc_any' | 'q' | 'lt' | 'lte' | 'gt' | 'gte';

/**
 * Filtering is passed in as the fields and the operations that should
 * take place. For example
 *
 * {"name_neq": 20}
 */
export type FilterItem = {
  field: string;
  value: string | number | string[] | number[];
  operation: FilterOperations;
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
      value: payload as any,
      operation: 'eq'
    });
  }

  return result;
};
