import { Embed } from './embed';
import { Sort } from './sort';
import { FilterItem } from './filter';

export { Embed, parseEmbed } from './embed';
export { FilterOperations, FilterItem, parseFilter } from './filter';
export { PaginationResponse, makeContentRange } from './pagination';
export { Range, parseRange } from './range';
export { Sort, parseSort } from './sort';

export interface RAQuery {
  embed: Embed;
  filter?: FilterItem[];
  sort?: Sort;
  range?: Range;
}
