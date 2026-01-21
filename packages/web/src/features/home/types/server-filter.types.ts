export type ServerFilterType = 'latest' | 'popular' | 'tag';

export interface ServerFilterParams {
  type: ServerFilterType;
  tags?: string[];
  search?: string;
  search_target: string;
}

export const DEFAULT_FILTER_TYPE: ServerFilterType = 'latest';
