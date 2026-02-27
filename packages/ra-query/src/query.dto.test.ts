import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RAQuery } from './query.dto';
import { FilterOperator } from './filter';

const VALID_RAW = {
  sort: '["title","ASC"]',
  range: '[0,24]',
  filter: '{"author_id":12}',
};

describe('RAQuery', () => {
  describe('plainToInstance', () => {
    it('parses all three fields', () => {
      const query = plainToInstance(RAQuery, VALID_RAW);

      expect(query.sort).toEqual({ field: 'title', order: 'ASC' });
      expect(query.range).toEqual({ page: 1, perPage: 25 });
      expect(query.filter).toEqual([{ field: 'author_id', operator: FilterOperator.Eq, value: 12 }]);
    });

    it('leaves optional fields undefined when absent', () => {
      const query = plainToInstance(RAQuery, {});

      expect(query.sort).toBeUndefined();
      expect(query.range).toBeUndefined();
      expect(query.filter).toBeUndefined();
    });

    it('parses only the fields that are present', () => {
      const query = plainToInstance(RAQuery, { sort: '["id","DESC"]' });

      expect(query.sort).toEqual({ field: 'id', order: 'DESC' });
      expect(query.range).toBeUndefined();
      expect(query.filter).toBeUndefined();
    });

    it('parses a descending sort', () => {
      const query = plainToInstance(RAQuery, { ...VALID_RAW, sort: '["created_at","DESC"]' });

      expect(query.sort).toEqual({ field: 'created_at', order: 'DESC' });
    });

    it('parses the second page', () => {
      const query = plainToInstance(RAQuery, { ...VALID_RAW, range: '[25,49]' });

      expect(query.range).toEqual({ page: 2, perPage: 25 });
    });

    it('parses a filter with an operator suffix', () => {
      const query = plainToInstance(RAQuery, { ...VALID_RAW, filter: '{"published_at_gte":"2020-01-01"}' });

      expect(query.filter).toEqual([{ field: 'published_at', operator: FilterOperator.Gte, value: '2020-01-01' }]);
    });

    it('parses a filter with a dot-notation nested field', () => {
      const query = plainToInstance(RAQuery, { ...VALID_RAW, filter: '{"author.name":"Tolstoi"}' });

      expect(query.filter).toEqual([{ field: 'author.name', operator: FilterOperator.Eq, value: 'Tolstoi' }]);
    });

    it('parses an empty filter to an empty array', () => {
      const query = plainToInstance(RAQuery, { ...VALID_RAW, filter: '{}' });

      expect(query.filter).toEqual([]);
    });
  });

  describe('validate', () => {
    it('passes with all fields present', async () => {
      const query = plainToInstance(RAQuery, VALID_RAW);
      const errors = await validate(query);

      expect(errors).toHaveLength(0);
    });

    it('passes with no fields', async () => {
      const query = plainToInstance(RAQuery, {});
      const errors = await validate(query);

      expect(errors).toHaveLength(0);
    });

    it('passes with only sort', async () => {
      const query = plainToInstance(RAQuery, { sort: '["id","ASC"]' });
      const errors = await validate(query);

      expect(errors).toHaveLength(0);
    });
  });
});
