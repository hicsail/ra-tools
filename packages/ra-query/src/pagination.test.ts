import { describe, it, expect } from 'vitest';
import { parseRange } from './pagination';

describe('parseRange', () => {
  it('parses the first page window', () => {
    expect(parseRange('[0,24]')).toEqual({ start: 0, end: 24 });
  });

  it('parses the second page window', () => {
    expect(parseRange('[25,49]')).toEqual({ start: 25, end: 49 });
  });

  it('parses the third page window', () => {
    expect(parseRange('[50,74]')).toEqual({ start: 50, end: 74 });
  });

  it('parses a smaller page size', () => {
    expect(parseRange('[0,4]')).toEqual({ start: 0, end: 4 });
  });

  it('parses the second window of a smaller page size', () => {
    expect(parseRange('[5,9]')).toEqual({ start: 5, end: 9 });
  });

  it('parses a single item range', () => {
    expect(parseRange('[0,0]')).toEqual({ start: 0, end: 0 });
  });

  it('throws on invalid JSON', () => {
    expect(() => parseRange('invalid')).toThrow('Invalid range parameter');
  });

  it('throws when value is not an array', () => {
    expect(() => parseRange('{"start":0}')).toThrow('Invalid range parameter');
  });

  it('throws when array has wrong length', () => {
    expect(() => parseRange('[0]')).toThrow('Invalid range parameter');
  });

  it('throws when values are not numbers', () => {
    expect(() => parseRange('["0","24"]')).toThrow('start and end must be numbers');
  });

  it('throws when start is negative', () => {
    expect(() => parseRange('[-1,24]')).toThrow('start must be >= 0');
  });

  it('throws when end is less than start', () => {
    expect(() => parseRange('[10,5]')).toThrow('end must be >= start');
  });
});
