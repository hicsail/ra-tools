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
  operation?: FilterOperations;
};

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

/**
 * Numeric range describing which items to show
 */
export type Range = {
  start: number;
  end: number;
};

/**
 * Child objects that could be embedded into a parent object
 */
export type Embed = string[];

/**
 * High level query object. Used when finding many objects
 */
export type RaQuery = {
  filter?: FilterItem[];
  sort?: Sort;
  range?: Range;
  embed?: Embed;
};
