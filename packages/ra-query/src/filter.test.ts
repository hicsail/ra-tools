import { describe, it, expect } from 'vitest';
import { parseFilter, FilterOperator } from './filter';

describe('parseFilter', () => {
  describe('plain field equality (implicit Eq)', () => {
    it('returns an empty array for an empty filter', () => {
      expect(parseFilter('{}')).toEqual([]);
    });

    it('parses a numeric field', () => {
      expect(parseFilter('{"author_id":12}')).toEqual([{ field: 'author_id', operator: FilterOperator.Eq, value: 12 }]);
    });

    it('parses a string field', () => {
      expect(parseFilter('{"status":"published"}')).toEqual([
        { field: 'status', operator: FilterOperator.Eq, value: 'published' },
      ]);
    });

    it('parses a boolean field', () => {
      expect(parseFilter('{"is_active":true}')).toEqual([
        { field: 'is_active', operator: FilterOperator.Eq, value: true },
      ]);
    });

    it('parses a null field', () => {
      expect(parseFilter('{"deleted_at":null}')).toEqual([
        { field: 'deleted_at', operator: FilterOperator.Eq, value: null },
      ]);
    });

    it('parses multiple flat fields', () => {
      expect(parseFilter('{"status":"published","category":"news"}')).toEqual([
        { field: 'status', operator: FilterOperator.Eq, value: 'published' },
        { field: 'category', operator: FilterOperator.Eq, value: 'news' },
      ]);
    });

    it('parses getMany-style id array', () => {
      expect(parseFilter('{"ids":[123,124,125]}')).toEqual([
        { field: 'ids', operator: FilterOperator.Eq, value: [123, 124, 125] },
      ]);
    });
  });

  describe('dot-notation for nested fields', () => {
    it('parses a nested field as Eq', () => {
      expect(parseFilter('{"author.name":"Leo Tolstoi"}')).toEqual([
        { field: 'author.name', operator: FilterOperator.Eq, value: 'Leo Tolstoi' },
      ]);
    });

    it('parses a numeric nested field as Eq', () => {
      expect(parseFilter('{"author.age":50}')).toEqual([
        { field: 'author.age', operator: FilterOperator.Eq, value: 50 },
      ]);
    });

    it('parses multiple levels of dot notation', () => {
      expect(parseFilter('{"address.country.code":"US"}')).toEqual([
        { field: 'address.country.code', operator: FilterOperator.Eq, value: 'US' },
      ]);
    });
  });

  describe('operator suffixes', () => {
    it('parses Gte', () => {
      expect(parseFilter('{"published_at_gte":"2015-06-12"}')).toEqual([
        { field: 'published_at', operator: FilterOperator.Gte, value: '2015-06-12' },
      ]);
    });

    it('parses Lte', () => {
      expect(parseFilter('{"published_at_lte":"2015-06-15"}')).toEqual([
        { field: 'published_at', operator: FilterOperator.Lte, value: '2015-06-15' },
      ]);
    });

    it('parses a date range producing two conditions', () => {
      expect(parseFilter('{"published_at_gte":"2015-06-12","published_at_lte":"2015-06-15"}')).toEqual([
        { field: 'published_at', operator: FilterOperator.Gte, value: '2015-06-12' },
        { field: 'published_at', operator: FilterOperator.Lte, value: '2015-06-15' },
      ]);
    });

    it('parses Gt and Lt', () => {
      expect(parseFilter('{"price_gt":10,"price_lt":100}')).toEqual([
        { field: 'price', operator: FilterOperator.Gt, value: 10 },
        { field: 'price', operator: FilterOperator.Lt, value: 100 },
      ]);
    });

    it('parses explicit Eq', () => {
      expect(parseFilter('{"status_eq":"published"}')).toEqual([
        { field: 'status', operator: FilterOperator.Eq, value: 'published' },
      ]);
    });

    it('parses Neq', () => {
      expect(parseFilter('{"status_neq":"archived"}')).toEqual([
        { field: 'status', operator: FilterOperator.Neq, value: 'archived' },
      ]);
    });

    it('parses EqAny with an array value', () => {
      expect(parseFilter('{"status_eq_any":["published","draft"]}')).toEqual([
        { field: 'status', operator: FilterOperator.EqAny, value: ['published', 'draft'] },
      ]);
    });

    it('parses NeqAny with an array value', () => {
      expect(parseFilter('{"status_neq_any":["archived","deleted"]}')).toEqual([
        { field: 'status', operator: FilterOperator.NeqAny, value: ['archived', 'deleted'] },
      ]);
    });

    it('parses IncAny with an array value', () => {
      expect(parseFilter('{"tags_inc_any":["react","admin"]}')).toEqual([
        { field: 'tags', operator: FilterOperator.IncAny, value: ['react', 'admin'] },
      ]);
    });

    it('parses Q for field-level full-text search', () => {
      expect(parseFilter('{"title_q":"react admin"}')).toEqual([
        { field: 'title', operator: FilterOperator.Q, value: 'react admin' },
      ]);
    });
  });

  describe('global full-text search (bare "q" key)', () => {
    it('parses q as field "q" with operator Q', () => {
      expect(parseFilter('{"q":"react"}')).toEqual([{ field: 'q', operator: FilterOperator.Q, value: 'react' }]);
    });
  });

  describe('dot-notation combined with operator suffix', () => {
    it('parses a nested field with Gte', () => {
      expect(parseFilter('{"author.age_gte":50}')).toEqual([
        { field: 'author.age', operator: FilterOperator.Gte, value: 50 },
      ]);
    });

    it('parses a nested field with Lte', () => {
      expect(parseFilter('{"author.age_lte":80}')).toEqual([
        { field: 'author.age', operator: FilterOperator.Lte, value: 80 },
      ]);
    });
  });

  describe('mixed conditions', () => {
    it('parses a mix of flat, dot-notation, and operator keys', () => {
      expect(parseFilter('{"is_active":true,"author.name":"Tolstoi","published_at_gte":"2020-01-01"}')).toEqual([
        { field: 'is_active', operator: FilterOperator.Eq, value: true },
        { field: 'author.name', operator: FilterOperator.Eq, value: 'Tolstoi' },
        { field: 'published_at', operator: FilterOperator.Gte, value: '2020-01-01' },
      ]);
    });
  });

  describe('invalid inputs', () => {
    it('throws on invalid JSON', () => {
      expect(() => parseFilter('invalid')).toThrow('Invalid filter parameter');
    });

    it('throws when value is a JSON array', () => {
      expect(() => parseFilter('[1,2,3]')).toThrow('expected a JSON object');
    });

    it('throws when value is a JSON string', () => {
      expect(() => parseFilter('"hello"')).toThrow('expected a JSON object');
    });

    it('throws when value is null', () => {
      expect(() => parseFilter('null')).toThrow('expected a JSON object');
    });

    it('throws when a field value is a nested object', () => {
      expect(() => parseFilter('{"address":{"city":"NY"}}')).toThrow('expected a JSON object with scalar values');
    });
  });
});
