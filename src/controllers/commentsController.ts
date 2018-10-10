import { Get, Post, Route, Controller, BodyProp, Query } from 'tsoa';

import Comment from '../entity/Comment';
import Movie from '../entity/Movie';
import { ConflictError } from '../helpers/exceptions';
import CommentFindConditions from '../types/CommentFindConditions';

@Route('comments')
export class CommentsController extends Controller {
  @Get()
  public async getComments(@Query() movieId?: number, @Query() id?: string): Promise<Comment[]> {
    const findConditions: CommentFindConditions = { movieId, id };
    return Comment.findWithConditions(findConditions);
  }

  @Post()
  public async createComment(@BodyProp() text: string, @BodyProp() movieId: number): Promise<Comment> {
    const movie = await Movie.findOne(movieId);
    if (!movie) throw new ConflictError(`Movie id ${movieId} not present in the database`);

    const comment = new Comment(movie.id, text);
    return comment.save();
  }
}
