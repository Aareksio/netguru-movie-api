import 'mocha';

import { expect } from 'chai';

import splitCSV from '../../helpers/splitCSV';

describe('Helpers', () => {
  describe('splitCSV', () => {
    it('returns an array', () => {
      const result = splitCSV('');
      expect(result).to.be.an('array');
    });

    it('splits by comma', () => {
      const result = splitCSV('a,b');
      expect(result[0]).to.be.equal('a');
      expect(result[1]).to.be.equal('b');
    });

    it('trims values', () => {
      const result = splitCSV('a, b');
      expect(result[0]).to.be.equal('a');
      expect(result[1]).to.be.equal('b');
    });
  });
});
