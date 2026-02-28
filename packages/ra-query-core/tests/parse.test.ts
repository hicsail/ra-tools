import { it } from "vitest";
/*
import { TransformationType, TransformFnParams } from 'class-transformer';
import { parseEmbed, parseFilter, parseRange, parseSort } from '../src/parse.js';
import { expect, test } from 'vitest';

const makeTransformInput = (value: unknown): TransformFnParams => ({
  value,
  key: 'test',
  obj: {},
  type: TransformationType.PLAIN_TO_CLASS,
  options: {}
});

test('should handle stringified field', () => {
  const filter = { field1: 'something' };
  expect(parseFilter(makeTransformInput(JSON.stringify(filter)))).toStrictEqual([{ field: 'field1', value: 'something' }]);
});

test('should handle parsed field', () => {
  const filter = { field1: 'something' };
  expect(parseFilter(makeTransformInput(filter))).toStrictEqual([{ field: 'field1', value: 'something' }]);
});

test('should allow an array of values', () => {
  const filter = { field1: ['something', 'something else'] };
  expect(parseFilter(makeTransformInput(filter))).toStrictEqual([{ field: 'field1', value: ['something', 'something else'] }]);
});

test('show throw error on invalid value', () => {
  const filter = { field1: { another: 'bad' } };
  expect(() => parseFilter(makeTransformInput(filter))).toThrow();
});

test('should handle string embed requests', () => {
  const result = parseEmbed(makeTransformInput('field'));
  expect(result).toStrictEqual(['field']);
});

test('should handle stringified array', () => {
  const expected = ['field1', 'field2'];
  const result = parseEmbed(makeTransformInput(JSON.stringify(expected)));
  expect(result).toStrictEqual(expected);
});

test('should handle already parsed arrays', () => {
  const result = parseEmbed(makeTransformInput(['field1', 'field2']));
  expect(result).toStrictEqual(['field1', 'field2']);
});

test('should throw error on number', () => {
  expect(() => parseEmbed(makeTransformInput(1))).toThrow();
});

test('should throw error on object', () => {
  expect(() => parseEmbed(makeTransformInput({ field: 1 }))).toThrow();
});
*/

it('shoudl workd', () => {

});
