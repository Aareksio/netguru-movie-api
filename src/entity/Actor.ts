import { Entity, ManyToMany, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

import Movie from './Movie';

@Entity()
export default class Actor extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(type => Movie, movie => movie.actors)
  movies: Movie[];

  constructor(name: string) {
    super();

    this.name = name;
  }

  static async findOneOrCreate(name: string): Promise<Actor> {
    const existingActor = await Actor.findOne({ name });
    if (existingActor) return existingActor;

    return new Actor(name);
  }
}
