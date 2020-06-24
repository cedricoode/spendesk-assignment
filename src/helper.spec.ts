import * as helper from './helper';
describe('helper', () => {
  describe('genRandomCard', () => {
    it('should generate random card number of length 16', () => {
      for (let i = 0; i < 10; i++) {
        expect(helper.genRandomCard().length).toBe(16);
      }
    });
  });

  describe('genRandomCvc', () => {
    it('should generate random cvc code of length 3', () => {
      for (let i = 0; i < 10; i++) {
        expect(helper.genRandomCvc().length).toBe(3);
      }
    });
  });
});
