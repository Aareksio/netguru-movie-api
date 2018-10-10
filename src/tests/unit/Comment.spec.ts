import 'mocha';

import { expect } from 'chai';
import { createSandbox } from 'sinon';

import Comment from '../../entity/Comment';

function createFakeComment() {
  const sandbox = createSandbox();

  const query = {} as any;

  query.where = sandbox.fake.returns(query);
  query.getMany = sandbox.fake.returns(Promise.resolve([]));

  return {
    createQueryBuilder: sandbox.fake.returns(query),
    query,
    reset: () => sandbox.reset()
  };
}

describe('Comment', () => {
  const FakeComment = createFakeComment();
  afterEach(() => FakeComment.reset());

  describe('findWithConditions', () => {
    it('applies moveId condition', async () => {
      await Comment.findWithConditions.call(FakeComment, { movieId: 1 });
      expect(FakeComment.query.where.callCount).to.be.equal(1);
      expect(FakeComment.query.where.lastCall.args).to.be.deep.equal([{ movieId: 1 }]);
    });

    it('applies id condition', async () => {
      await Comment.findWithConditions.call(FakeComment, { id: '1' });
      expect(FakeComment.query.where.callCount).to.be.equal(1);
      expect(FakeComment.query.where.lastCall.args).to.be.deep.equal(['comment.id IN (:...id)', { id: ['1'] }]);
    });

    it('applies no conditions if none specified', async () => {
      await Comment.findWithConditions.call(FakeComment, {});
      expect(FakeComment.query.where.callCount).to.be.equal(0);
    });
  });
});
