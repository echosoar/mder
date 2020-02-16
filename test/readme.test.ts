import Mder from '../src';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
describe('Readme', () => {
  it('common', () => {
    const mder = new Mder();
    mder.parse(`
# Mder
全能力支持的markdown解析器，将markdown文本转换为Json对象，可用于后续解析生产为HTML、PDF等内容。
---
### 使用方式
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

### 已支持的Feature

[x] 一级标题 ~ 六级标题
[x] 有序列表
[x] 无序列表
[x] 引用内容
[x] 代码段
[x] 分割线
[x] 任务列表
[x] 加粗
[x] 斜体
[x] 图片
[x] 超链接
    `);
    const result = mder.getResult();
    writeFileSync(resolve(__dirname, './json/readme_common.json'), JSON.stringify(result, null, '  '));
    expect(true).toBeTruthy();
  });
});
