import PaginationOptions from './PaginationOptions';
import SortOptions from './SortOptions';

export default interface MovieFindConditions extends PaginationOptions, SortOptions {
  title?: string;
  year?: string;
  genre?: string;
  director?: string;
  actor?: string;
  language?: string;
  country?: string;
  imdbID?: string;
  type?: string;
  comments?: boolean;
}
