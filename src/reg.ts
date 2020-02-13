export const BoldReg = /\*{2}([^\*].*?)\*{2}|\*{4}/g;
export const ItalicReg = /_([^_].*?)_|\*([^\*].*?)\*/g;
export const ImgAndLinkReg = /!\[([^\[\(]*)\]\((.*?)\)|\[([^\[\(]*)\]\((.*?)\)/g;
export const OlReg = /^(\s*)\d+\.\s+(.*)$/;
export const UlReg = /^(\s*)[-+]\s+(.*)$/;
export const HeadReg = /^(#{1,6})\s+(.*)$/;
export const BlockquoteReg = /^(>{1,})\s+(.*)$/;
export const CodeReg = /^`{3}(.*)$/;
