import 'reflect-metadata';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { parseSort, type Sort } from './sort';
import { parsePagination, type Pagination } from './pagination';
import { parseFilter, type Filter } from './filter';

export class RAQuery {
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => (value !== undefined ? parseSort(value) : undefined))
  sort?: Sort;

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => (value !== undefined ? parsePagination(value) : undefined))
  range?: Pagination;

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => (value !== undefined ? parseFilter(value) : undefined))
  filter?: Filter;
}
