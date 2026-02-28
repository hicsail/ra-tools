import { describe, it, expect } from "vitest";
import { TransformFnParams } from '../src/utility';
import { parseEmbed } from '../src/embed';

const makeParams = (input: unknown): TransformFnParams => {
  return {
    value: input,
    key: 'unimportant',
    obj: {}
  };
}

describe('parseEmbed', () => {
  it('should handle string embed requests', () => {
    const result = parseEmbed(makeParams('field'));
    expect(result).toStrictEqual(['field']);
  });

  it('should handle stringified array', () => {
    const expected = ['field1', 'field2'];
    const result = parseEmbed(makeParams(JSON.stringify(expected)));
    expect(result).toStrictEqual(expected);
  });

  it('should handle already parsed arrays', () => {
    const result = parseEmbed(makeParams(['field1', 'field2']));
    expect(result).toStrictEqual(['field1', 'field2']);
  });

  it('should throw error on number', () => {
    expect(() => parseEmbed(makeParams(1))).toThrow();
  });

  it('should throw error on object', () => {
    expect(() => parseEmbed(makeParams({ field: 1 }))).toThrow();
  });
});
