import { TransformationType, TransformFnParams } from 'class-transformer';
import { parseEmbed, parseFilter, parseRange, parseSort } from './parse.js';
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

test('should handle stringified valid field and direction', () => {
  const expected = ['field1', 'ASC'];
  expect(parseSort(makeTransformInput(JSON.stringify(expected)))).toStrictEqual({
    field: 'field1',
    direction: 'ASC'
  });
});

test('should handle valid field and direction', () => {
  expect(parseSort(makeTransformInput(['field1', 'ASC']))).toStrictEqual({ field: 'field1', direction: 'ASC' });
  expect(parseSort(makeTransformInput(['field1', 'DESC']))).toStrictEqual({ field: 'field1', direction: 'DESC' });
});

test('should throw error on invalid number of elements', () => {
  expect(() => parseSort(makeTransformInput(['field1']))).toThrow();
});

test('should throw error on invalid field name', () => {
  expect(() => parseSort(makeTransformInput([1, 'DESC']))).toThrow();
});

test('should throw error on wrong direction', () => {
  expect(() => parseSort(makeTransformInput([1, 'diff']))).toThrow();
});

test('should handle stringified range of 1 element', () => {
  expect(parseRange(makeTransformInput('[1]'))).toStrictEqual({ start: 0, end: 1 });
});

test('should handle stringified range of 2 elements', () => {
  expect(parseRange(makeTransformInput('[1, 2]'))).toStrictEqual({ start: 1, end: 2 });
});

test('should handle parsed array of 1 element', () => {
  expect(parseRange(makeTransformInput([1]))).toStrictEqual({ start: 0, end: 1 });
});

test('should handle parsed array of 2 elements', () => {
  expect(parseRange(makeTransformInput([1, 2]))).toStrictEqual({ start: 1, end: 2 });
});

test('should throw error if not array object', () => {
  expect(() => parseRange(makeTransformInput('bad'))).toThrow();
});

test('should throw error if array of non-numbers', () => {
  expect(() => parseRange(makeTransformInput(['bad', 2]))).toThrow();
});

test('should throw error if elements in wrong order', () => {
  expect(() => parseRange(makeTransformInput([3, 2]))).toThrow();
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
