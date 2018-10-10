import { Entity, OneToMany, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

import Movie from './Movie';

@Entity()
export default class Type extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(type => Movie, movie => movie.type)
  movies: Movie[];

  constructor(name: string) {
    super();

    this.name = name;
  }

  static async findOneOrCreate(name: string): Promise<Type> {
    const existingType = await Type.findOne({ name });
    if (existingType) return existingType;

    return new Type(name);
  }
}
