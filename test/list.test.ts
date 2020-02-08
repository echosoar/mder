import Mder from '../src';

describe('List', () => {
  it('ol mix ul', () => {
    const mder = new Mder();
    mder.parse(`
1. line1
2. line2
3. line3

1. line1
1. line1
1. line1
+ ul1
- ul2
- ul3
+ ul4
   1. level2
   2. level2
    `);
    const result = mder.getResult();
    expect(result[3].type === 'ul' && result[3].childs[3].childs[0].type === 'ol').toBeTruthy();
  });
});
