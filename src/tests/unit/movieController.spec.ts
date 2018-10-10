import 'mocha';

import { ValidateError } from 'tsoa';
import { use, expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import { MoviesController } from '../../controllers/moviesController';

use(chaiAsPromised);

describe('movieController', () => {
  describe('createMovie', () => {
    it('throws an error when both title and id are not present', () => {
      const controller = new MoviesController();

      const expectedError = new ValidateError({
        id: { message: 'Either id or title is required', value: undefined },
        title: { message: 'Either id or title is required', value: undefined }
      }, '');

      return expect(controller.createMovie({ })).to.eventually.rejectedWith().deep.equal(expectedError);
    })
  });
});


