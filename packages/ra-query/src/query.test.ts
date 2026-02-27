import { describe, it, expect } from 'vitest';
import { parseQuery } from './query';
import { FilterOperator } from './filter';

const VALID_PARAMS = {
  sort: '["title","ASC"]',
  range: '[0,24]',
  filter: '{"author_id":12}',
};

function toSearchParams(params: Record<string, string>): URLSearchParams {
  return new URLSearchParams(params);
}

describe('parseQuery', () => {
  describe('accepts URLSearchParams', () => {
    it('parses a valid getList query', () => {
      expect(parseQuery(toSearchParams(VALID_PARAMS))).toEqual({
        sort: { field: 'title', order: 'ASC' },
        pagination: { page: 1, perPage: 25 },
        filter: [{ field: 'author_id', operator: FilterOperator.Eq, value: 12 }],
      });
    });
  });

  describe('accepts a raw query string', () => {
    it('parses without a leading ?', () => {
      const qs = 'sort=["title","ASC"]&range=[0,24]&filter={"author_id":12}';
      expect(parseQuery(qs)).toEqual({
        sort: { field: 'title', order: 'ASC' },
        pagination: { page: 1, perPage: 25 },
        filter: [{ field: 'author_id', operator: FilterOperator.Eq, value: 12 }],
      });
    });

    it('parses with a leading ?', () => {
      const qs = '?sort=["id","DESC"]&range=[25,49]&filter={}';
      expect(parseQuery(qs)).toEqual({
        sort: { field: 'id', order: 'DESC' },
        pagination: { page: 2, perPage: 25 },
        filter: [],
      });
    });
  });

  describe('missing parameters', () => {
    it('throws when sort is missing', () => {
      const { sort: _, ...rest } = VALID_PARAMS;
      expect(() => parseQuery(toSearchParams(rest))).toThrow('Missing required query parameter: sort');
    });

    it('throws when range is missing', () => {
      const { range: _, ...rest } = VALID_PARAMS;
      expect(() => parseQuery(toSearchParams(rest))).toThrow('Missing required query parameter: range');
    });

    it('throws when filter is missing', () => {
      const { filter: _, ...rest } = VALID_PARAMS;
      expect(() => parseQuery(toSearchParams(rest))).toThrow('Missing required query parameter: filter');
    });
  });

  describe('forwards malformed parameter errors', () => {
    it('throws on bad sort value', () => {
      expect(() => parseQuery(toSearchParams({ ...VALID_PARAMS, sort: 'bad' }))).toThrow('Invalid sort parameter');
    });

    it('throws on bad range value', () => {
      expect(() => parseQuery(toSearchParams({ ...VALID_PARAMS, range: 'bad' }))).toThrow('Invalid range parameter');
    });

    it('throws on bad filter value', () => {
      expect(() => parseQuery(toSearchParams({ ...VALID_PARAMS, filter: 'bad' }))).toThrow('Invalid filter parameter');
    });
  });
});
