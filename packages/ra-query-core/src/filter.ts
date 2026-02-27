import { unpack, eachElementIsType } from './utility';
import { TransformFnParams } from './utility';

/** Supported operations from FakeRest Standard */
const supportedOperations = [
  'eq', 'neq', 'eq_any', 'neq_any', 'inc_any', 'q', 'lt', 'lte', 'gt', 'gte'
] as const;

/** Typescript definition for the supported operations */
export type FilterOperations = typeof supportedOperations[number];

/** Helper for more cleaner selection of operations */
export const FilterOperations = {
  get Equal(): FilterOperations { return 'eq' },
  get NotEqual(): FilterOperations { return 'neq' },
  get EqualAny(): FilterOperations { return 'neq_any' },
  get NotEqualAny(): FilterOperations { return 'neq_any' },
  get IncludeAny(): FilterOperations { return 'inc_any' },
  get Query(): FilterOperations { return 'q' },
  get LessThan(): FilterOperations { return 'lt' },
  get LessThanEqual(): FilterOperations { return 'lte' },
  get GreaterThan(): FilterOperations { return 'gt' },
  get GreaterThanEqual(): FilterOperations { return 'gte' }
}

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

/**
 * Helper to parse the filer name itself. FakeRest's spec
 * allows for including the operation in the name as a postfix.
 *
 * For example
 * "author.lastname_neq" => { field: "author.lastname", operation: FilterOperations.NotEqual }
 */
export const parseFilterName = (fieldRaw: string): { field: string, operation: FilterOperations } => {
  const components = fieldRaw.split('_');

  // If there is only one element, then the operation postfix isn't present
  if (components.length === 1) {
    return { field: fieldRaw, operation: FilterOperations.Equal };
  }

  const lastIndex = components[components.length - 1];
  const operation = supportedOperations.find(operation => operation === lastIndex);

  // No matching operation, default to equals
  if (operation === undefined) {
    return { field: fieldRaw, operation: FilterOperations.Equal };
  }

  // Matching operation found, pull off the postfix
  const lengthOfPostfix = operation.length + 1  // +1 for the underscore
  const fieldName = fieldRaw.slice(0, -lengthOfPostfix);

  return { field: fieldName, operation };
}

/**
 * Handle parsing a single filter item. This involves getting
 * the following information.
 *
 * Field Name: What field (including dot operator) to search over
 * Operator: Equal, not equal, etc
 * Value: What to search for over the target field
 */
export const parseFilterItem = (field: string, value: unknown): FilterItem => {
  // Value itself cannot be an object
  if (typeof value === 'object' && !Array.isArray(value)) {
    throw new Error('value of a filter must be an array or primitive');
  }

  // Can not have an undefined value
  if (value === undefined) {
    throw new Error('Value of the value cannot be undefined');
  }

  // If the type is an array, make sure each element is valid
  const valueType = typeof value;
  if (Array.isArray(value)) {
    if (!eachElementIsType(value, 'string') && !eachElementIsType(value, 'number')) {
      throw new Error('Each elemenet of a filter value must be a string or number');
    }
  } else if (valueType != 'number' && valueType != 'string') {
    throw new Error("A value that isn't an array needs to be a string or number");
  }

  return {
    field,
    value: value as any,
    operation: FilterOperations.Equal
  }
};

export const parseFilter = (params: TransformFnParams): FilterItem[] => {
  const value = params.value;

  // Disallow null values
  if (value === null || value === undefined) {
    throw new Error('Null/Undefined cannot be converted into filter');
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
      operation: FilterOperations.Equal
    });
  }

  return result;
};
