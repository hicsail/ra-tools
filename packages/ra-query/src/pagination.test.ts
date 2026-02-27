import { describe, it, expect } from 'vitest';
import { parsePagination } from './pagination';

describe('parsePagination', () => {
  it('parses first page with perPage 25', () => {
    expect(parsePagination('[0,24]')).toEqual({ page: 1, perPage: 25 });
  });

  it('parses second page with perPage 25', () => {
    expect(parsePagination('[25,49]')).toEqual({ page: 2, perPage: 25 });
  });

  it('parses third page with perPage 25', () => {
    expect(parsePagination('[50,74]')).toEqual({ page: 3, perPage: 25 });
  });

  it('parses first page with perPage 5', () => {
    expect(parsePagination('[0,4]')).toEqual({ page: 1, perPage: 5 });
  });

  it('parses second page with perPage 5', () => {
    expect(parsePagination('[5,9]')).toEqual({ page: 2, perPage: 5 });
  });

  it('parses single item range', () => {
    expect(parsePagination('[0,0]')).toEqual({ page: 1, perPage: 1 });
  });

  it('throws on invalid JSON', () => {
    expect(() => parsePagination('invalid')).toThrow('Invalid range parameter');
  });

  it('throws when value is not an array', () => {
    expect(() => parsePagination('{"start":0}')).toThrow('Invalid range parameter');
  });

  it('throws when array has wrong length', () => {
    expect(() => parsePagination('[0]')).toThrow('Invalid range parameter');
  });

  it('throws when values are not numbers', () => {
    expect(() => parsePagination('["0","24"]')).toThrow(
      'rangeStart and rangeEnd must be numbers'
    );
  });

  it('throws when rangeStart is negative', () => {
    expect(() => parsePagination('[-1,24]')).toThrow('rangeStart must be >= 0');
  });

  it('throws when rangeEnd is less than rangeStart', () => {
    expect(() => parsePagination('[10,5]')).toThrow('rangeEnd must be >= rangeStart');
  });
});
