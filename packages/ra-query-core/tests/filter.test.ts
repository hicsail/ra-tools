import { describe, expect, it } from "vitest";
import { parseFilterName, FilterOperations, parseFilterValue, parseFilter } from '../src/filter';
import { TransformFnParams } from "../src/utility";

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

  it('should handle plain name with not equal any', () => {
    expect(parseFilterName('author_neq_any')).toEqual({ field: 'author', operation: FilterOperations.NotEqualAny });
  });

  it('should handle nested objects with not equal any', () => {
    expect(parseFilterName('author.last_name_neq_any')).toEqual({ field: 'author.last_name', operation: FilterOperations.NotEqualAny });
  });
});

describe('parseFilterItem', () => {
  it('should parse basic number value', () => {
    expect(parseFilterValue(5)).toEqual(5);
  });

  it('should parse basic string value', () => {
    expect(parseFilterValue('hello')).toEqual('hello');
  });

  it('should parse array of numbers', () => {
    expect(parseFilterValue([5, 6, 7])).toEqual([5, 6, 7]);
  });

  it('should parse array of strings', () => {
    expect(parseFilterValue(['hey', 'there'])).toEqual(['hey', 'there']);
  });

  it('should disallow mixed arrays', () => {
    expect(() => parseFilterValue([1, '2'])).toThrow();
  })

  it('should disallow passing in objects', () => {
    expect(() => parseFilterValue({ name: 'Bob' })).toThrow();
  });
});

const makeParams = (input: string): TransformFnParams => {
  return {
    value: input,
    key: 'unimportant',
    obj: {}
  };
}

describe('parseFilter', () => {
  it('should handle plain single filter', () => {
    expect(parseFilter(makeParams('{"author": "bob"}'))).toEqual([
      { field: 'author', value: 'bob', operation: FilterOperations.Equal }
    ])
  });

  it('should handle plain multi-filter', () => {
    const filter = JSON.stringify({
      author: 'Harper Lee Collins',
      title: 'To Kill a Mocking Bird'
    });

    expect(parseFilter(makeParams(filter))).toEqual([
      { field: 'author', value: 'Harper Lee Collins', operation: FilterOperations.Equal },
      { field: 'title', value: 'To Kill a Mocking Bird', operation: FilterOperations.Equal }
    ]);
  });

  it('should handle nested objects', () => {
    const filter = JSON.stringify({
      'author.name': 'Harper Lee Collins'
    });

    expect(parseFilter(makeParams(filter))).toEqual([
      { field: 'author.name', value: 'Harper Lee Collins', operation: FilterOperations.Equal }
    ]);
  });

  it('should handle nested objects with specified operation', () => {
    const filter = JSON.stringify({
      'author.name_neq': 'Harper Lee Collins'
    });

    expect(parseFilter(makeParams(filter))).toEqual([
      { field: 'author.name', value: 'Harper Lee Collins', operation: FilterOperations.NotEqual }
    ]);
  });

  it('should disallow invalid JSON objects', () => {
    expect(() => parseFilter(makeParams('authorname=bob'))).toThrow();
  });
});
