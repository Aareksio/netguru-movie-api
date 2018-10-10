import { Entity, Column, ManyToMany, ManyToOne, OneToMany, JoinTable, PrimaryGeneratedColumn, BaseEntity, Like, getConnection } from 'typeorm';

import Type from './Type';
import Genre from './Genre';
import Actor from './Actor';
import Rating from './Rating';
import Comment from './Comment';
import Director from './Director';
import Language from './Language';

import OMDBMovie from '../types/OMDBMovie';
import splitCSV from '../helpers/splitCSV';
import MovieFindConditions from '../types/MovieFindConditions';

@Entity()
export default class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  year: number;

  @Column()
  rated: string;

  @Column()
  released: string;

  @Column()
  runtime: string;

  @ManyToMany(type => Genre, genre => genre.movies, { cascade: true, eager: true })
  @JoinTable()
  genres: Genre[];

  @ManyToOne(type => Director, director => director.movies, { cascade: true, eager: true })
  director: Director;

  // Could be extracted to relation in the future
  @Column('text')
  writer: string;

  @ManyToMany(type => Actor, actor => actor.movies, { cascade: true, eager: true })
  @JoinTable()
  actors: Actor[];

  @Column()
  plot: string;

  @ManyToOne(type => Language, language => language.movies, { cascade: true, eager: true })
  language: Language;

  @Column()
  country: string;

  @Column()
  awards: string;

  @Column()
  poster: string;

  @OneToMany(type => Rating, rating => rating.movie, { cascade: true, eager: true })
  ratings: Rating[];

  @Column()
  metascore: string;

  @Column({ unique: true })
  imdbID: string;

  @Column()
  imdbRating: number;

  @Column()
  imdbVotes: string;

  @ManyToOne(type => Type, type => type.movies, { cascade: true, eager: true })
  type: Type;

  @Column()
  dvd: string;

  @Column()
  boxOffice: string;

  @Column()
  production: string;

  @Column()
  website: string;

  @OneToMany(type => Comment, comment => comment.movie)
  comments: Comment[];

  static async fromOMDBMovie(omdbMovie: OMDBMovie): Promise<Movie> {
    const existingMovie = Movie.findOne({ imdbID: omdbMovie.imdbID });
    if (existingMovie) return existingMovie;

    const movie = new Movie();

    movie.dvd = omdbMovie.DVD;
    movie.plot = omdbMovie.Plot;
    movie.title = omdbMovie.Title;
    movie.rated = omdbMovie.Rated;
    movie.writer = omdbMovie.Writer;
    movie.awards = omdbMovie.Awards;
    movie.poster = omdbMovie.Poster;
    movie.imdbID = omdbMovie.imdbID;
    movie.website = omdbMovie.Website;
    movie.runtime = omdbMovie.Runtime;
    movie.country = omdbMovie.Country;
    movie.released = omdbMovie.Released;
    movie.metascore = omdbMovie.Metascore;
    movie.imdbVotes = omdbMovie.imdbVotes;
    movie.boxOffice = omdbMovie.BoxOffice;
    movie.production = omdbMovie.Production;

    movie.year = parseInt(omdbMovie.Year, 10);
    movie.imdbRating = parseInt(omdbMovie.imdbRating, 10);

    movie.type = await Type.findOneOrCreate(omdbMovie.Type);
    movie.director = await Director.findOneOrCreate(omdbMovie.Director);
    movie.language = await Language.findOneOrCreate(omdbMovie.Language);

    movie.ratings = omdbMovie.Ratings.map(rating => new Rating(rating.Source, rating.Value));

    movie.genres = await Promise.all(splitCSV(omdbMovie.Genre).map(genre => Genre.findOneOrCreate(genre)));
    movie.actors = await Promise.all(splitCSV(omdbMovie.Actors).map(actor => Actor.findOneOrCreate(actor)));

    return movie;
  }

  // Since we offer filtering by relations, this needs to be done using QueryBuilder
  static async findWithConditions(conditions: MovieFindConditions): Promise<Movie[]> {
    // First get ids of movies meeting the conditions, we cannot load relations yet as it'd break pagination
    const movieIds = await this.findMovieIdsWithConditions(conditions);

    // Connect all relations
    const moviesQueryBuilder = this.createQueryBuilder('movie')
      .leftJoinAndSelect('movie.type', 'type')
      .leftJoinAndSelect('movie.genres', 'genres')
      .leftJoinAndSelect('movie.actors', 'actors')
      .leftJoinAndSelect('movie.ratings', 'ratings')
      .leftJoinAndSelect('movie.director', 'director')
      .leftJoinAndSelect('movie.language', 'language')
      .where('movie.id IN (:...movieIds)', { movieIds });

    if (conditions.comments) moviesQueryBuilder.leftJoinAndSelect('movie.comments', 'comments');
    if (conditions.sortBy && this.isSortableColumn(conditions.sortBy)) moviesQueryBuilder.orderBy(`movie.${conditions.sortBy}`, conditions.sortType === 'DESC' ? 'DESC' : 'ASC');

    return moviesQueryBuilder.getMany();
  }

  private static async findMovieIdsWithConditions(conditions: MovieFindConditions): Promise<number[]> {
    const movieIdQueryBuilder = this.createQueryBuilder('movie').select('movie.id');
    applyConditions(movieIdQueryBuilder, conditions);

    const movies: Array<{ id: number }> = await movieIdQueryBuilder.getMany();
    return movies.map(movie => movie.id);
  }

  private static isSortableColumn(columnName: string): boolean {
    const sortableColumns = Array.from(getConnection().getMetadata(this).columns)
      .filter(column => !column.isVirtual) // Only own columns, no relations
      .map(column => column.propertyName);

    return sortableColumns.includes(columnName);
  }
}

function applyConditions(queryBuilder, conditions) {
  Object.entries(conditions)
    .filter(([parameter, value]) => typeof value !== 'undefined')
    .forEach(([parameter, value]) => applyCondition(queryBuilder, parameter, value));
}

function applyCondition(queryBuilder, parameter, value) {
  switch (parameter) {
    case 'title':
      return applyLikeCondition(queryBuilder, parameter, value);
    case 'year':
    case 'country':
    case 'imdbID':
      return applyInCondtion(queryBuilder, parameter, splitCSV(value));
    case 'genre':
    case 'director':
    case 'actor':
    case 'language':
    case 'type':
      return applyRelationInCondition(queryBuilder, parameter, splitCSV(value));
    case 'limit':
      return queryBuilder.take(value);
    case 'start':
      return queryBuilder.skip(value);
  }
}

export function applyLikeCondition(queryBuilder, parameter, value) {
  return queryBuilder.where({ [parameter]: Like(value) });
}

export function applyInCondtion(queryBuilder, parameter, value) {
  return queryBuilder.where(`movie.${parameter} IN (:...${parameter})`, { [parameter]: value });
}

export function applyRelationInCondition(queryBuilder, parameter, value, parameterKey = 'name') {
  return queryBuilder.where(relationIn(parameter, parameterKey, value));
}

function relationIn(relation, parameter, value) {
  return qb => {
    const subQuery = qb
      .subQuery()
      .select('movies.id')
      .from(relation)
      .leftJoin(`${relation}.movies`, 'movies')
      .where(`${relation}.${parameter} IN (:...${relation})`, { [relation]: value })
      .getQuery();

    return `movie.id IN ${subQuery}`;
  }
}
