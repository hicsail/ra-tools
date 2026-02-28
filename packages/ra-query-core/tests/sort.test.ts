import { describe, it, expect } from "vitest";
import { parseSort } from '../src/sort'
import { TransformFnParams } from "../src/utility";

const makeParams = (input: unknown): TransformFnParams => {
  return {
    value: input,
    key: 'unimportant',
    obj: {}
  };
}

describe('parseSort', () => {
  it('should handle stringified valid field and direction', () => {
    const expected = ['field1', 'ASC'];
    expect(parseSort(makeParams(JSON.stringify(expected)))).toStrictEqual({
      field: 'field1',
      direction: 'ASC'
    });
  });

  it('should handle valid field and direction', () => {
    expect(parseSort(makeParams(['field1', 'ASC']))).toStrictEqual({ field: 'field1', direction: 'ASC' });
    expect(parseSort(makeParams(['field1', 'DESC']))).toStrictEqual({ field: 'field1', direction: 'DESC' });
  });

  it('should throw error on invalid number of elements', () => {
    expect(() => parseSort(makeParams(['field1']))).toThrow();
  });

  it('should throw error on invalid field name', () => {
    expect(() => parseSort(makeParams([1, 'DESC']))).toThrow();
  });

  it('should throw error on wrong direction', () => {
    expect(() => parseSort(makeParams([1, 'diff']))).toThrow();
  });
});
