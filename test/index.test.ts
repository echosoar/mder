import Mder from '../src';

describe('Base', () => {
  it('Mder is class', () => {
    expect(typeof Mder).toBe('function');
    expect(/^class/.test(Mder.toString())).toBeTruthy();
  });
});
