import 'reflect-metadata';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { parseSort, type Sort } from './sort';
import { parseRange, type Range } from './pagination';
import { parseFilter, type Filter } from './filter';

export class RAQuery {
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => (value !== undefined ? parseSort(value) : undefined))
  sort?: Sort;

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => (value !== undefined ? parseRange(value) : undefined))
  range?: Range;

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => (value !== undefined ? parseFilter(value) : undefined))
  filter?: Filter;
}
