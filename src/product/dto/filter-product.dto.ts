export interface FilterProductDto {
  producer?: string;
  country?: string;
  segment?: string;
  naming?: 'asc' | 'desc';
}
