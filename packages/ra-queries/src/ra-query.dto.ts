import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { parseRange, parseSort, parseFilter } from './parse.js';
import { PaginationResponse } from './pagination.dto.js';
import { FilterItem } from './filter';
import { Sort } from './sort';
import { Range } from './range';

export class RAQuery {
  @IsOptional()
  @Transform(parseSort)
  sort?: Sort;

  @IsOptional()
  @Transform(parseRange)
  range?: Range;

  @IsOptional()
  @Transform(parseFilter)
  filter?: FilterItem[];
}

export const makeContentRange = (name: string, pagination: PaginationResponse<unknown>): string => {
  return `${name} ${pagination.start}-${pagination.end}/${pagination.count}`;
};
