import { Entity, OneToMany, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

import Movie from './Movie';

@Entity()
export default class Director extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(type => Movie, movie => movie.director)
  movies: Movie[];

  constructor(name: string) {
    super();

    this.name = name;
  }

  static async findOneOrCreate(name: string): Promise<Director> {
    const existingDirector = await Director.findOne({ name });
    if (existingDirector) return existingDirector;

    return new Director(name);
  }
}
