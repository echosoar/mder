import Mder from '../src';

describe('Item', () => {
  it('mix text link bold itelic and img', () => {
    const mder = new Mder();
    mder.parse(`
    as[d](link)[![编组.png](imgsrc)](123)[d**asd**](link)**as**_**d**a_sd
    `);
    const result = mder.getResult();
    console.log('result', JSON.stringify(result, null, '  '));
    expect(
      result[0].type === 'group').toBeTruthy();
  });
});
