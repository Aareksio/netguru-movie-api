interface MovieSearchBodyBase {
  type?: 'movie' | 'series' | 'episode';
  year?: number;
}

export default interface MovieSearchBody extends MovieSearchBodyBase {
  id?: string;
  title?: string;
}
