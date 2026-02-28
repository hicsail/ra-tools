import { unpack, eachElementIsType } from './utility';
import { TransformFnParams } from './utility';

/** Supported operations from FakeRest Standard */
const supportedOperations = ['neq_any', 'eq_any', 'inc_any', 'neq', 'lte', 'gte', 'lt', 'gt', 'eq', 'q'] as const;

/** Typescript definition for the supported operations */
export type FilterOperations = (typeof supportedOperations)[number];

/** Helper for more cleaner selection of operations */
export const FilterOperations = {
  get Equal(): FilterOperations {
    return 'eq';
  },
  get NotEqual(): FilterOperations {
    return 'neq';
  },
  get EqualAny(): FilterOperations {
    return 'neq_any';
  },
  get NotEqualAny(): FilterOperations {
    return 'neq_any';
  },
  get IncludeAny(): FilterOperations {
    return 'inc_any';
  },
  get Query(): FilterOperations {
    return 'q';
  },
  get LessThan(): FilterOperations {
    return 'lt';
  },
  get LessThanEqual(): FilterOperations {
    return 'lte';
  },
  get GreaterThan(): FilterOperations {
    return 'gt';
  },
  get GreaterThanEqual(): FilterOperations {
    return 'gte';
  }
};

export type FilterValueType = string | number | string[] | number[];

/**
 * Filtering is passed in as the fields and the operations that should
 * take place. For example
 *
 * {"name_neq": 20}
 */
export type FilterItem = {
  field: string;
  value: FilterValueType;
  operation: FilterOperations;
};

/**
 * Helper to parse the filer name itself. FakeRest's spec
 * allows for including the operation in the name as a postfix.
 *
 * For example
 * "author.lastname_neq" => { field: "author.lastname", operation: FilterOperations.NotEqual }
 */
export const parseFilterName = (fieldRaw: string): { field: string; operation: FilterOperations } => {
  // See if any of the operators show up at the end, the operators are ordered to
  // avoid partial matches
  for (const operation of supportedOperations) {
    if (fieldRaw.endsWith(operation)) {
      // Matching operation found, pull off the postfix
      const lengthOfPostfix = operation.length + 1; // +1 for the underscore
      const fieldName = fieldRaw.slice(0, -lengthOfPostfix);

      return { field: fieldName, operation };
    }
  }

  // No matching operation found, return the field and the default equals
  return { field: fieldRaw, operation: FilterOperations.Equal };
};

export const parseFilterValue = (value: unknown): FilterValueType => {
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

  // Need to play with type definitions. I believe at this point the
  // type should be certain.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return value as any;
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
  for (const fieldRaw in unpacked as any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const valueRaw = (unpacked as any)[fieldRaw] as unknown;

    const { field, operation } = parseFilterName(fieldRaw);
    const value = parseFilterValue(valueRaw);

    result.push({
      field,
      operation,
      value
    });
  }

  return result;
};
