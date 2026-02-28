import { describe, it, expect } from "vitest";
import { TransformFnParams } from "../src/utility";
import { parseRange } from '../src/range'

const makeParams = (input: unknown): TransformFnParams => {
  return {
    value: input,
    key: 'unimportant',
    obj: {}
  };
}

describe('parseRange', () => {
  it('should handle stringified range of 1 element', () => {
    expect(parseRange(makeParams('[1]'))).toStrictEqual({ start: 0, end: 1 });
  });

  it('should handle stringified range of 2 elements', () => {
    expect(parseRange(makeParams('[1, 2]'))).toStrictEqual({ start: 1, end: 2 });
  });

  it('should handle parsed array of 1 element', () => {
    expect(parseRange(makeParams([1]))).toStrictEqual({ start: 0, end: 1 });
  });

  it('should handle parsed array of 2 elements', () => {
    expect(parseRange(makeParams([1, 2]))).toStrictEqual({ start: 1, end: 2 });
  });

  it('should throw error if not array object', () => {
    expect(() => parseRange(makeParams('bad'))).toThrow();
  });

  it('should throw error if array of non-numbers', () => {
    expect(() => parseRange(makeParams(['bad', 2]))).toThrow();
  });

  it('should throw error if elements in wrong order', () => {
    expect(() => parseRange(makeParams([3, 2]))).toThrow();
  });
});
