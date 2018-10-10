import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import Movie from './Movie';

@Entity()
export default class Genre extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(type => Movie, movie => movie.genres)
  movies: Movie[];

  constructor(name: string) {
    super();

    this.name = name;
  }

  static async findOneOrCreate(name: string): Promise<Genre> {
    const existingGenre = await Genre.findOne({ name });
    if (existingGenre) return existingGenre;

    return new Genre(name);
  }
}
