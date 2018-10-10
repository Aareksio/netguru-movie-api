import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from 'typeorm';

import Movie from './Movie';
import CommentFindConditions from '../types/CommentFindConditions';
import splitCSV from '../helpers/splitCSV';

@Entity()
export default class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  text: string;

  @Column()
  movieId: number;

  @ManyToOne(type => Movie, movie => movie.comments, { nullable: false })
  movie: Movie;

  constructor(movieId: number, text: string) {
    super();

    this.movieId = movieId;
    this.text = text;
  }

  static async findWithConditions(conditions: CommentFindConditions): Promise<Comment[]> {
    const commentQueryBuilder = this.createQueryBuilder('comment');

    if (conditions.movieId) commentQueryBuilder.where({ movieId: conditions.movieId });
    if (conditions.id) commentQueryBuilder.where('comment.id IN (:...id)', { id: splitCSV(conditions.id) });

    return commentQueryBuilder.getMany();
  }
}
