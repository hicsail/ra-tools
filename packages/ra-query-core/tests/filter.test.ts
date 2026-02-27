import { describe, expect, it } from "vitest";
import { parseFilterName, FilterOperations } from '../src/filter';

describe('parseFilterName', () => {
  it('should parse plain names', () => {
    expect(parseFilterName('author')).toEqual({ field: 'author', operation: FilterOperations.Equal });
  });

  it('should handle nested objects', () => {
    expect(parseFilterName('author.first')).toEqual({ field: 'author.first', operation: FilterOperations.Equal});
  });

  it('should handle underscores in filter name', () => {
    expect(parseFilterName('author.last_name')).toEqual({ field: 'author.last_name', operation: FilterOperations.Equal });
  });

  it('should handle plain name with equal operation', () => {
    expect(parseFilterName('author_eq')).toEqual({ field: 'author', operation: FilterOperations.Equal });
  });

  it('should handle plain name with not equal operation', () => {
    expect(parseFilterName('author_neq')).toEqual({ field: 'author', operation: FilterOperations.NotEqual });
  });
});
