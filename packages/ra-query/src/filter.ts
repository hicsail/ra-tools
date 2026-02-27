/**
 * Comparison operators supported by FakeRest as key suffixes.
 *
 * Append to a field name (or dot-notation path) in the raw filter key:
 *   "published_at_gte", "author.age_lte", "status_eq_any"
 *
 * The bare key "q" (no field prefix) signals a global full-text search.
 */
export enum FilterOperator {
  Eq = '_eq', // field === value
  Neq = '_neq', // field !== value
  EqAny = '_eq_any', // field === any of value[]
  NeqAny = '_neq_any', // field !== any of value[]
  IncAny = '_inc_any', // array field includes any of value[]
  Q = '_q', // full-text search (field-level or global via bare "q" key)
  Lt = '_lt', // field < value
  Lte = '_lte', // field <= value
  Gt = '_gt', // field > value
  Gte = '_gte', // field >= value
}

/** A scalar value that can appear in a filter comparison. */
export type ScalarFilterValue = string | number | boolean | null;

/**
 * A filter value is either a scalar or an array of scalars.
 * Arrays are used with _eq_any, _neq_any, and _inc_any operators.
 */
export type FilterValue = ScalarFilterValue | ScalarFilterValue[];

/** A single parsed filter condition with the field, operator, and value separated. */
export interface FilterCondition {
  /** Dot-notation field path, e.g. "author.name". "q" for global full-text search. */
  field: string;
  /** The comparison operator to apply. Defaults to Eq when no suffix was present. */
  operator: FilterOperator;
  /** The value to compare against. */
  value: FilterValue;
}

export type Filter = FilterCondition[];

// Longer suffixes must be checked before shorter ones to avoid partial matches
// (e.g. EqAny must be matched before Eq).
const OPERATORS: FilterOperator[] = [
  FilterOperator.NeqAny,
  FilterOperator.EqAny,
  FilterOperator.IncAny,
  FilterOperator.Gte,
  FilterOperator.Lte,
  FilterOperator.Neq,
  FilterOperator.Gt,
  FilterOperator.Lt,
  FilterOperator.Eq,
  FilterOperator.Q,
];

const parseFilterKey = (key: string): { field: string; operator: FilterOperator } => {
  // The bare "q" key is the global full-text search signal — no field prefix.
  if (key === 'q') {
    return { field: 'q', operator: FilterOperator.Q };
  }

  for (const operator of OPERATORS) {
    if (key.endsWith(operator)) {
      return { field: key.slice(0, -operator.length), operator };
    }
  }

  return { field: key, operator: FilterOperator.Eq };
};

const isScalarFilterValue = (value: unknown): value is ScalarFilterValue =>
  value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';

const isFilterValue = (value: unknown): value is FilterValue => {
  if (isScalarFilterValue(value)) return true;
  if (Array.isArray(value)) return value.every(isScalarFilterValue);
  return false;
};

const isRawFilter = (value: unknown): value is Record<string, FilterValue> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  return Object.values(value).every(isFilterValue);
};

/**
 * Parses the `filter` query parameter from ra-data-simple-rest / FakeRest into
 * an array of structured conditions, each with a `field`, `operator`, and `value`.
 *
 * Raw key formats handled:
 *   "author_id"              → { field: "author_id",     operator: Eq,     value: 12 }
 *   "author.name"            → { field: "author.name",   operator: Eq,     value: "Tolstoi" }
 *   "published_at_gte"       → { field: "published_at",  operator: Gte,    value: "2015-06-12" }
 *   "author.age_lte"         → { field: "author.age",    operator: Lte,    value: 50 }
 *   "status_eq_any"          → { field: "status",        operator: EqAny,  value: [...] }
 *   "q"                      → { field: "q",             operator: Q,      value: "react" }
 */
export const parseFilter = (value: string): Filter => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error(`Invalid filter parameter: expected JSON object, got "${value}"`);
  }

  if (!isRawFilter(parsed)) {
    throw new Error(`Invalid filter parameter: expected a JSON object with scalar values`);
  }

  return Object.entries(parsed).map(([key, val]) => {
    const { field, operator } = parseFilterKey(key);
    return { field, operator, value: val };
  });
};
