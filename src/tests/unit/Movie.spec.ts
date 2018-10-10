import 'mocha';

import { expect } from 'chai';
import { Like } from 'typeorm';
import { createSandbox, fake } from 'sinon';

import Movie, { applyInCondtion, applyLikeCondition, applyRelationInCondition } from '../../entity/Movie';

function createFakeMovie() {
  const sandbox = createSandbox();

  const query = {  } as any;

  query.leftJoinAndSelect = sandbox.fake.returns(query);
  query.where = sandbox.fake.returns(query);
  query.orderBy = sandbox.fake.returns(query);
  query.getMany = sandbox.fake.returns(Promise.resolve([]));

  return {
    findMovieIdsWithConditions: sandbox.fake.returns([]),
    createQueryBuilder: sandbox.fake.returns(query),
    isSortableColumn: sandbox.fake(value => ['title', 'id'].includes(value)),
    query,
    reset: () => sandbox.reset()
  }
}

describe('Movie', () => {
  const FakeMovie = createFakeMovie();
  afterEach(() => FakeMovie.reset());
  
  describe('applyLikeCondition', () => {
    it('applies LIKE condition', () => {
      applyLikeCondition(FakeMovie.query, 'title', 'Guardians');

      expect(FakeMovie.query.where.callCount).to.be.equal(1);
      expect(FakeMovie.query.where.lastCall.args.length).to.be.equal(1);
      expect(FakeMovie.query.where.lastCall.args[0]).to.be.deep.equal({ title: Like('Guardians') });
    });
  });

  describe('applyInCondtion', () => {
    it('applies IN condition', () => {
      applyInCondtion(FakeMovie.query, 'year', ['2009']);

      expect(FakeMovie.query.where.callCount).to.be.equal(1);
      expect(FakeMovie.query.where.lastCall.args.length).to.be.equal(2);
      expect(FakeMovie.query.where.lastCall.args[0]).to.be.equal('movie.year IN (:...year)');
      expect(FakeMovie.query.where.lastCall.args[1]).to.be.deep.equal({ year: ['2009'] });
    });
  });

  describe('applyRelationInCondition', () => {
    it('applies Relation IN condition', () => {
      applyRelationInCondition(FakeMovie.query, 'genre', ['Drama']);

      expect(FakeMovie.query.where.callCount).to.be.equal(1);
      expect(FakeMovie.query.where.lastCall.args.length).to.be.equal(1);
      expect(FakeMovie.query.where.lastCall.args[0]).to.be.a('function');
    });
  });

  describe('findWithConditions', () => {
    it('joins all relations', async () => {
      await Movie.findWithConditions.call(FakeMovie, {});

      expect(FakeMovie.query.leftJoinAndSelect.callCount).to.be.equal(6);
      expect(FakeMovie.query.leftJoinAndSelect.args).to.be.deep.equal([
        ['movie.type', 'type'],
        ['movie.genres', 'genres'],
        ['movie.actors', 'actors'],
        ['movie.ratings', 'ratings'],
        ['movie.director', 'director'],
        ['movie.language', 'language']
      ]);
    });

    it('joins comments if conditions specified', async () => {
      await Movie.findWithConditions.call(FakeMovie, { comments: true });
      expect(FakeMovie.query.leftJoinAndSelect.lastCall.args).to.be.deep.equal(['movie.comments', 'comments']);
    });

    it('applies sort', async () => {
      await Movie.findWithConditions.call(FakeMovie, { sortBy: 'title' });
      expect(FakeMovie.query.orderBy.callCount).to.be.equal(1);
      expect(FakeMovie.query.orderBy.lastCall.args).to.be.deep.equal(['movie.title', 'ASC']);
    });

    it('applies sort order', async () => {
      await Movie.findWithConditions.call(FakeMovie, { sortBy: 'title', sortType: 'DESC' });
      expect(FakeMovie.query.orderBy.callCount).to.be.equal(1);
      expect(FakeMovie.query.orderBy.lastCall.args).to.be.deep.equal(['movie.title', 'DESC']);
    });

    it('ignores invalid sort columns', async () => {
      await Movie.findWithConditions.call(FakeMovie, { sortBy: 'invalid column' });
      expect(FakeMovie.query.orderBy.callCount).to.be.equal(0);
    })
  });
});


