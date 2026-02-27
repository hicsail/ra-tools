import { describe, it, expect } from 'vitest';
import { parseSort } from './sort';

describe('parseSort', () => {
  it('parses ascending sort', () => {
    expect(parseSort('["title","ASC"]')).toEqual({ field: 'title', order: 'ASC' });
  });

  it('parses descending sort', () => {
    expect(parseSort('["id","DESC"]')).toEqual({ field: 'id', order: 'DESC' });
  });

  it('parses a numeric-looking field name', () => {
    expect(parseSort('["created_at","ASC"]')).toEqual({
      field: 'created_at',
      order: 'ASC',
    });
  });

  it('throws on invalid JSON', () => {
    expect(() => parseSort('invalid')).toThrow('Invalid sort parameter');
  });

  it('throws when order is lowercase', () => {
    expect(() => parseSort('["title","asc"]')).toThrow(
      'order must be "ASC" or "DESC"'
    );
  });

  it('throws when value is not an array', () => {
    expect(() => parseSort('"title"')).toThrow('Invalid sort parameter');
  });

  it('throws when array has wrong length', () => {
    expect(() => parseSort('["title"]')).toThrow('Invalid sort parameter');
  });

  it('throws when field is not a string', () => {
    expect(() => parseSort('[42,"ASC"]')).toThrow('field must be a string');
  });
});
