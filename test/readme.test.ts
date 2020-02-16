import Mder from '../src';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
describe('Readme', () => {
  it('common', () => {
    const mder = new Mder();
    mder.parse(`
# Mder

The full-featured markdown parser, converts Markdown text into JSON objects, which can be used to produce HTML, PDF and other content.

---
### Usage
\`\`\`shell
$ npm i mder --save
\`\`\`

\`\`\`javascript
const Mder = require('mder');
const mder = new Mder();
    mder.parse(\`
# h1
[ ] tesk not complete
[x] tesk complete
\`);
const result = mder.getResult();
\`\`\`

### Feature Supported

- [x] 一级标题 ~ 六级标题
- [x] 有序列表
- [x] 无序列表
- [x] 引用内容
- [x] 代码段
- [x] 分割线
- [x] 任务列表
- [x] 加粗
- [x] 斜体
- [x] 图片
- [x] 超链接

### Data after this readme parsed
\`\`\`JSON
\`\`\`

### License
MIT
    `);
    const result = mder.getResult();
    writeFileSync(resolve(__dirname, './json/readme_common.json'), JSON.stringify(result, null, '  '));
    expect(true).toBeTruthy();
  });
});
