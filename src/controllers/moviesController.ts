import { Get, Post, Route, Controller, Body, ValidateError, Query, Path, BodyProp } from 'tsoa';
import * as got from 'got';

import Movie from '../entity/Movie';
import MovieSearchBody from '../types/MovieSearchBody';
import { OMDBError } from '../helpers/exceptions';
import MovieFindConditions from '../types/MovieFindConditions';
import Comment from '../entity/Comment';
import { CommentsController } from './commentsController';

async function fetchMovie(movieSearchBody : MovieSearchBody) {
  const query = {
    apikey: process.env.OMDBAPI_KEY,
    i: movieSearchBody.id,
    t: movieSearchBody.title,
    y: movieSearchBody.year,
    type: movieSearchBody.type
  };

  const movieJson = await got('omdbapi.com', { query })
    .then(response => JSON.parse(response.body));

  if (movieJson.Response !== 'True') throw new OMDBError(movieJson.Error);

  return Movie.fromOMDBMovie(movieJson);
}

@Route('movies')
export class MoviesController extends Controller {
  @Get()
  public async getMovies(@Query() title?: string, @Query() year?: string, @Query() genre?: string,
                         @Query() director?: string, @Query() actor?: string, @Query() language?: string,
                         @Query() country?: string, @Query() imdbID?: string, @Query() type?: string,
                         @Query() limit?: number, @Query() start?: number, @Query() sortBy?: string,
                         @Query() sortType?: string, @Query() comments?: boolean): Promise<Movie[]> {
    const findConditions: MovieFindConditions = { title, year, genre, director, actor, language, country, imdbID, type, limit, start, sortBy, sortType, comments };
    return Movie.findWithConditions(findConditions);
  }

  @Post()
  public async createMovie(@Body() movieSearchBody: MovieSearchBody): Promise<Movie> {
    // tsoa doesn't support types as parameters, we need to check if either `id` or `title` is present manually
    if (!movieSearchBody.id && !movieSearchBody.title) {
      throw new ValidateError({
        id: { message: 'Either id or title is required', value: movieSearchBody.id },
        title: { message: 'Either id or title is required', value: movieSearchBody.title }
      }, '');
    }

    const movie = await fetchMovie(movieSearchBody);
    return movie.save();
  }

  @Get('{id}/comments')
  public async getMovieComments(@Path('id') movieId: number): Promise<Comment[]> {
    const commentsController = new CommentsController();
    return commentsController.getComments(movieId);
  }

  @Post('{id}/comments')
  public async createMovieComment(@Path('id') movieId: number, @BodyProp() text: string) {
    const commentsController = new CommentsController();
    return commentsController.createComment(text, movieId);
  }
}
