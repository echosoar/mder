import {
  BoldReg,
  HeadReg,
  ImgAndLinkReg,
  ItalicReg,
  OlReg,
  UlReg,
} from './reg';
export default class Mder {
  private innerSplit: string = ':mder:&:split:';
  private result: any = [];
  public parse(mdContent: string) {
    const allLine = mdContent.split(/\n/);
    while (allLine.length) {
      const currentLine = allLine.shift();
      // empty line
      if (/^\s*$/.test(currentLine)) {
        this.result.push({ type: 'empty' });
        continue;
      }
      // head1 to head6
      if (/^#{1,6}\s/.test(currentLine)) {
        this.formatHead(currentLine);
        continue;
      }

      // ul
      if (/^\s*[-+]\s/.test(currentLine)) {
        this.formatUl(currentLine);
        continue;
      }

      // ol
      if (/^\s*\d+\.\s/.test(currentLine)) {
        this.formatOl(currentLine);
        continue;
      }

      this.result.push(this.formatLine(currentLine));
    }
  }

  public getResult() {
    const result = [];
    this.result.forEach((line: any) => {
      this.format(result, line);
    });
    return result;
  }

  private format(result, line) {
    const pre = result && result[result.length - 1];

    if (pre && pre.type === 'head') {
      if (line.type === 'head' && pre.level >= line.level) {
        result.push(line);
      } else {
        if (!pre.childs) {
          pre.childs = [];
        }
        this.format(pre.childs, line);
      }
    } else {
      if (line.type === 'empty' && result.length === 0) {
        return;
      } else {
        // list
        if (line.type === 'ol' || line.type === 'ul') { // ul -> n item -> line or other
          if (pre) {
            if (pre.type === line.type) {
              if (pre.level === line.level) {
                this.format(pre.childs, line.childs[0]);
                return;
              }
            }
            if (pre.type === 'ol' || pre.type === 'ul') {
              if (pre.level < line.level) {
                const preLastChild = pre.childs[pre.childs.length - 1];
                if (!preLastChild.childs) {
                  preLastChild.childs = [];
                }
                this.format(preLastChild.childs, line);
                return;
              }
            }
          }
        }
        result.push(line);
      }
    }
  }

  private formatLine(line: string) {
    const tmp = [];
    const newLine = this.formatImgAndLink(line, tmp);
    return {
      type: 'line',
      childs: this.splitGroupLine(newLine, tmp),
    };
  }

  private splitGroupLine(line, tmp) {
    const result = [];
    line.split(this.innerSplit).forEach((value) => {
      if (!value) {
        return;
      }
      if (/^\d+$/.test(value)) {
        result.push(tmp[value]);
      } else {
        result.push(...this.formatBoldAndItalic(value));
      }
    });
    return result;
  }

  private formatHead(line: string) {
    const headInfo = HeadReg.exec(line);
    this.result.push({ type: 'head', level: headInfo[1].length, value: headInfo[2] });
  }

  private formatUl(line: string) {
    const ulInfo = UlReg.exec(line);
    this.result.push({
      type: 'ul',
      level: ulInfo[1].length,
      childs: [{
        type: 'item',
        childs: [this.formatLine(ulInfo[2])],
      }],
    });
  }

  private formatOl(line: string) {
    const olInfo = OlReg.exec(line);
    this.result.push({
      type: 'ol',
      level: olInfo[1].length,
      childs: [{
        type: 'item',
        childs: [this.formatLine(olInfo[2])],
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

    // _123*123_
    // _213*213*123_
    // *13_123*
    // *123_123_123*
    tmp = tmp || [];
    let newLine = line;
    while (BoldReg.test(newLine)) {
      newLine = newLine.replace(BoldReg, (_, boldContent) => {
        if (!boldContent) {
          return;
        }
        tmp.push({ type: 'bold', childs: this.formatBoldAndItalic(boldContent, tmp) });
        return  this.innerSplit + (tmp.length - 1) + this.innerSplit;
      });
    }

    while (ItalicReg.test(newLine)) {
      newLine = newLine.replace(ItalicReg, (_, itaOne, itaTwo) => {
        tmp.push({ type: 'italic', childs: this.formatBoldAndItalic(itaOne || itaTwo, tmp) });
        return  this.innerSplit + (tmp.length - 1) + this.innerSplit;
      });
    }

    // const boldAndItalicReg = /**(.*?)**/g;
    // let newLine = line;
    // while (boldAndItalicReg.test(newLine)) {
    //   newLine = newLine.replace(boldAndItalicReg, (match) => {
    //     return match;
    //   });
    // }

    const result = [];
    newLine.split(this.innerSplit).forEach((value) => {
      if (!value) {
        return;
      }
      if (/^\d+$/.test(value)) {
        result.push(tmp[value]);
      } else {
        result.push({ type: 'text', value });
      }
    });
    return result;
  }
}
