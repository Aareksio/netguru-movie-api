import { Entity, Column, ManyToOne, PrimaryColumn, BaseEntity } from 'typeorm';

import Movie from './Movie';

@Entity()
export default class Rating extends BaseEntity {
  @PrimaryColumn()
  source: string;

  @Column()
  value: string;

  @ManyToOne(type => Movie, movie => movie.ratings, { primary: true })
  movie: Movie;

  constructor(source: string, value: string) {
    super();

    this.source = source;
    this.value = value;
  }
}
