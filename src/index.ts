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

      this.result.push(this.formatGroup(currentLine));
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
        if (line.type === 'ol' || line.type === 'ul') {
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

  private formatGroup(line: string) {
    const tmp = [];
    const newLine = this.formatImgAndLink(line, tmp);
    return {
      type: 'group',
      contents: this.splitGroupLine(newLine, tmp),
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
    const headInfo = /^(#{1,6})\s*(.*?)$/.exec(line);
    this.result.push({ type: 'head', level: headInfo[1].length, value: headInfo[2] });
  }

  private formatUl(line: string) {
    const ulInfo = /^(\s*)[-+]\s*(.*)$/.exec(line);
    this.result.push({ type: 'ul', level: ulInfo[1].length, childs: [this.formatGroup(ulInfo[2])] });
  }

  private formatOl(line: string) {
    const olInfo = /^(\s*)\d+\.\s*(.*)$/.exec(line);
    this.result.push({ type: 'ol', level: olInfo[1].length, childs: [this.formatGroup(olInfo[2])] });
  }

  private formatImgAndLink(line: string, contentList) {
    const imgAndLinkReg = /!\[([^\[\(]*)\]\((.*?)\)|\[([^\[\(]*)\]\((.*?)\)/g;
    let newLine = line;
    while (imgAndLinkReg.test(newLine)) {
      newLine = newLine.replace(imgAndLinkReg, (match, imgTitle, imgSrc, linkTitle, linkHref) => {
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

  private formatBoldAndItalic(line: string) {

    // _123*123_
    // _213*213*123_
    // *13_123*
    // *123_123_123*
    const tmp = [];
    // const boldAndItalicReg = /_()_\*\*()\*\*/g;
    // let newLine = line;
    // while (boldAndItalicReg.test(newLine)) {
    //   newLine = newLine.replace(boldAndItalicReg, (match) => {
    //     return match;
    //   });
    // }

    const result = [];
    line.split(this.innerSplit).forEach((value) => {
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
