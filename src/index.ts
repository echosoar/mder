import {
  BlockquoteReg,
  BoldReg,
  HeadReg,
  ImgAndLinkReg,
  ItalicReg,
  OlReg,
  UlReg,
  CodeReg,
} from './reg';
export default class Mder {
  private innerSplit: string = ':mder:&:split:';
  private result: any = [];
  public parse(mdContent: string) {
    const allLine = mdContent.split(/\n/);
    let execInfo = null;
    let notMatch = false;
    while (allLine.length) {
      const currentLine = allLine.shift();
      // code
      execInfo = CodeReg.exec(currentLine);
      if (execInfo) {
        if (!notMatch) {
          notMatch = true;
          this.insertToResult({ type: 'code', lang: execInfo[1], childs: []});
        } else {
          notMatch = false;
        }
        continue;
      }

      if (notMatch) {
        this.insertNotMatch(currentLine);
        continue;
      }

      // empty line
      if (/^\s*$/.test(currentLine)) {
        this.insertToResult({ type: 'empty' });
        continue;
      }
      // head1 to head6
      execInfo = HeadReg.exec(currentLine);
      if (execInfo) {
        this.insertToResult({ type: 'head', level: execInfo[1].length, value: execInfo[2] });
        continue;
      }

      // ul
      execInfo = UlReg.exec(currentLine);
      if (execInfo) {
        this.formatList('ul', execInfo);
        continue;
      }

      // ol
      execInfo = OlReg.exec(currentLine);
      if (execInfo) {
        this.formatList('ol', execInfo);
        continue;
      }

      // blockquote
      execInfo = BlockquoteReg.exec(currentLine);
      if (execInfo) {
        this.insertToResult({
          type: 'blockquote',
          level: execInfo[1].length,
          childs: [{
            type: 'item',
            childs: [this.formatLine(execInfo[2])],
          }],
        });
        continue;
      }

      this.insertToResult(this.formatLine(currentLine));
    }
  }

  public getResult() {
    return this.result;
  }

  private formatLine(line: string) {
    const tmp = [];
    const newLine = this.formatImgAndLink(line, tmp);
    return { type: 'line', childs: this.splitGroupLine(newLine, tmp) };
  }

  // 用来处理包含bold、italic等的一行内容
  private splitGroupLine(line, tmp, onlyText?: boolean) {
    const result = [];
    line.split(this.innerSplit).forEach((value) => {
      if (!value) {
        return;
      }
      if (/^\d+$/.test(value)) {
        result.push(tmp[value]);
      } else if (onlyText) {
        result.push({ type: 'text', value });
      } else {
        result.push(...this.formatBoldAndItalic(value));
      }
    });
    return result;
  }

  private formatList(type, listInfo) {
    this.insertToResult({
      type,
      level: listInfo[1].length,
      childs: [{
        type: 'item',
        childs: [this.formatLine(listInfo[2])],
      }],
    });
  }

  private formatImgAndLink(line: string, contentList) {
    let newLine = line;
    while (ImgAndLinkReg.test(newLine)) {
      newLine = newLine.replace(ImgAndLinkReg, (match, imgTitle, imgSrc, linkTitle, linkHref) => {
        if (imgTitle || imgSrc) {
          contentList.push({ type: 'img', alt: imgTitle, src: imgSrc });
        } else if (linkTitle || linkHref) {
          contentList.push({ type: 'link', childs: this.splitGroupLine(linkTitle, contentList), href: linkHref });
        } else {
          return match;
        }
        return this.innerSplit + (contentList.length - 1) + this.innerSplit;
      });
    }
    return newLine;
  }

  private formatBoldAndItalic(line: string, tmp?: any) {
    tmp = tmp || [];
    let newLine = line;
    const regList = [
      { type: 'bold', reg: BoldReg, replace: (boldContent) => (boldContent && this.formatBoldAndItalic(boldContent, tmp)) },
      { type: 'italic', reg: ItalicReg, replace: (itaOne, itaTwo) => (this.formatBoldAndItalic(itaOne || itaTwo, tmp)) },
    ];
    regList.forEach((regInfo: any) => {
      while (regInfo.reg.test(newLine)) {
        newLine = newLine.replace(regInfo.reg, (_, ...args) => {
          const childs = (regInfo.replace as any)(...args);
          if (!childs) {
            return '';
          }
          tmp.push({ type: regInfo.type, childs });
          return  this.innerSplit + (tmp.length - 1) + this.innerSplit;
        });
      }
    });
    return this.splitGroupLine(newLine, tmp, true);
  }

  private insertToResult(item, result?) {
    result = result || this.result;
    const pre = result && result[result.length - 1];
    if (pre && pre.type === 'head') {
      if (item.type === 'head' && pre.level >= item.level) {
        result.push(item);
      } else {
        if (!pre.childs) {
          pre.childs = [];
        }
        this.insertToResult(item, pre.childs);
      }
      return;
    }
    if (item.type === 'empty' && result.length === 0) {
      return;
    }

    if (item.level != null) {
      if (pre) {
        if (pre.type === item.type) {
          if (pre.level === item.level) {
            this.insertToResult(item.childs[0], pre.childs);
            return;
          }
        }
        if (pre.level != null) {
          if (pre.level < item.level) {
            const preLastChild = pre.childs[pre.childs.length - 1];
            if (!preLastChild.childs) {
              preLastChild.childs = [];
            }
            this.insertToResult(item, preLastChild.childs);
            return;
          }
        }
      }
    }
    result.push(item);
  }

  private insertNotMatch(currentLine) {
    const pre = this.result[this.result.length - 1];
    pre.childs.push({ type: 'line', childs: [{type: 'text', value: currentLine }]});
  }
}
