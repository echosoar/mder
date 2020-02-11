import Mder from '../src';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
describe('Head', () => {
  it('common', () => {
    const mder = new Mder();
    mder.parse(`
# h1
## h2
### h3
#### h4
##### h5
###### h6
    `);
    const result = mder.getResult();
    writeFileSync(resolve(__dirname, './json/head_common.json'), JSON.stringify(result, null, '  '));
    expect(result[0].childs[0].childs[0].childs[0].level).toBe(4);
  });
  it('not header', () => {
    const mder = new Mder();
    mder.parse(`
####not h4
 #not h1
something # is not head
    `);
    const result = mder.getResult();
    writeFileSync(resolve(__dirname, './json/head_not.json'), JSON.stringify(result, null, '  '));
    expect(result[0].type === 'line' && result[1].type === 'line' && result[2].type === 'line').toBeTruthy();
  });
});
