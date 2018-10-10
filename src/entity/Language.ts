import { Entity, OneToMany, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

import Movie from './Movie';

@Entity()
export default class Language extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(type => Movie, movie => movie.language)
  movies: Movie[];

  constructor(name: string) {
    super();

    this.name = name;
  }

  static async findOneOrCreate(name: string): Promise<Language> {
    const existingLanguage = await Language.findOne({ name });
    if (existingLanguage) return existingLanguage;

    return new Language(name);
  }
}
