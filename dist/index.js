"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reg_1 = require("./reg");
class Mder {
    constructor() {
        this.innerSplit = ':mder:&:split:';
        this.result = [];
    }
    parse(mdContent) {
        const allLine = mdContent.split(/\n/);
        let execInfo = null;
        let notMatch = false;
        while (allLine.length) {
            const currentLine = allLine.shift();
            execInfo = reg_1.CodeReg.exec(currentLine);
            if (execInfo) {
                if (!notMatch) {
                    notMatch = true;
                    this.insertToResult({ type: 'code', lang: execInfo[1], childs: [] });
                }
                else {
                    notMatch = false;
                }
                continue;
            }
            if (notMatch) {
                this.insertNotMatch(currentLine);
                continue;
            }
            if (/^\s*$/.test(currentLine)) {
                this.insertToResult({ type: 'empty' });
                continue;
            }
            execInfo = reg_1.HeadReg.exec(currentLine);
            if (execInfo) {
                this.insertToResult({ type: 'head', level: execInfo[1].length, value: execInfo[2] });
                continue;
            }
            execInfo = reg_1.UlReg.exec(currentLine);
            if (execInfo) {
                this.formatList('ul', execInfo);
                continue;
            }
            execInfo = reg_1.OlReg.exec(currentLine);
            if (execInfo) {
                this.formatList('ol', execInfo);
                continue;
            }
            execInfo = reg_1.BlockquoteReg.exec(currentLine);
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
    getResult() {
        return this.result;
    }
    formatLine(line) {
        const tmp = [];
        const newLine = this.formatImgAndLink(line, tmp);
        return {
            type: 'line',
            childs: this.splitGroupLine(newLine, tmp),
        };
    }
    splitGroupLine(line, tmp) {
        const result = [];
        line.split(this.innerSplit).forEach((value) => {
            if (!value) {
                return;
            }
            if (/^\d+$/.test(value)) {
                result.push(tmp[value]);
            }
            else {
                result.push(...this.formatBoldAndItalic(value));
            }
        });
        return result;
    }
    formatList(type, listInfo) {
        this.insertToResult({
            type,
            level: listInfo[1].length,
            childs: [{
                    type: 'item',
                    childs: [this.formatLine(listInfo[2])],
                }],
        });
    }
    formatImgAndLink(line, contentList) {
        let newLine = line;
        while (reg_1.ImgAndLinkReg.test(newLine)) {
            newLine = newLine.replace(reg_1.ImgAndLinkReg, (match, imgTitle, imgSrc, linkTitle, linkHref) => {
                if (imgTitle || imgSrc) {
                    contentList.push({ type: 'img', alt: imgTitle, src: imgSrc });
                }
                else if (linkTitle || linkHref) {
                    contentList.push({ type: 'link', childs: this.splitGroupLine(linkTitle, contentList), href: linkHref });
                }
                else {
                    return match;
                }
                return this.innerSplit + (contentList.length - 1) + this.innerSplit;
            });
        }
        return newLine;
    }
    formatBoldAndItalic(line, tmp) {
        tmp = tmp || [];
        let newLine = line;
        while (reg_1.BoldReg.test(newLine)) {
            newLine = newLine.replace(reg_1.BoldReg, (_, boldContent) => {
                if (!boldContent) {
                    return;
                }
                tmp.push({ type: 'bold', childs: this.formatBoldAndItalic(boldContent, tmp) });
                return this.innerSplit + (tmp.length - 1) + this.innerSplit;
            });
        }
        while (reg_1.ItalicReg.test(newLine)) {
            newLine = newLine.replace(reg_1.ItalicReg, (_, itaOne, itaTwo) => {
                tmp.push({ type: 'italic', childs: this.formatBoldAndItalic(itaOne || itaTwo, tmp) });
                return this.innerSplit + (tmp.length - 1) + this.innerSplit;
            });
        }
        const result = [];
        newLine.split(this.innerSplit).forEach((value) => {
            if (!value) {
                return;
            }
            if (/^\d+$/.test(value)) {
                result.push(tmp[value]);
            }
            else {
                result.push({ type: 'text', value });
            }
        });
        return result;
    }
    insertToResult(item, result) {
        result = result || this.result;
        const pre = result && result[result.length - 1];
        if (pre && pre.type === 'head') {
            if (item.type === 'head' && pre.level >= item.level) {
                result.push(item);
            }
            else {
                if (!pre.childs) {
                    pre.childs = [];
                }
                this.insertToResult(item, pre.childs);
            }
        }
        else {
            if (item.type === 'empty' && result.length === 0) {
                return;
            }
            else {
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
        }
    }
    insertNotMatch(currentLine) {
        const pre = this.result[this.result.length - 1];
        pre.childs.push({ type: 'line', childs: [{ type: 'text', value: currentLine }] });
    }
}
exports.default = Mder;
