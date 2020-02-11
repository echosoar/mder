import Mder from '../src';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
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
    writeFileSync(resolve(__dirname, './list_mix_ol_and_ul.json'), JSON.stringify(result, null, '  '));
    expect(
      result[3].type === 'ul' &&
      result[3].childs[3].type === 'item' &&
      result[3].childs[3].childs[0].type === 'line' &&
      result[3].childs[3].childs[0].childs[0].type === 'text' &&
      result[3].childs[3].childs[0].childs[0].value === 'ul4' &&
      result[3].childs[3].childs[1].type === 'ol' &&
      result[3].childs[3].childs[1].childs[0].type === 'item' &&
      result[3].childs[3].childs[1].childs[0].childs[0].type === 'line' &&
      result[3].childs[3].childs[1].childs[0].childs[0].childs[0].type === 'text' &&
      result[3].childs[3].childs[1].childs[0].childs[0].childs[0].value === 'level2',
    ).toBeTruthy();
  });
});
