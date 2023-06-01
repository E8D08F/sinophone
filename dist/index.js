#!/usr/bin/env deno run --allow-read --allow-write --allow-run
import yargs from 'https://deno.land/x/yargs@v17.7.2-deno/deno.ts';
import { compress, decompress } from 'https://deno.land/x/zip@v1.2.5/mod.ts';
import path from 'node:path';
import { walk } from 'https://deno.land/std@0.170.0/fs/walk.ts';
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

var xmlHeader = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
var serialiseToString = function (node) {
    var tagName = node.tagName.toLowerCase();
    return "<".concat(tagName) +
        Array.from(node.attributes).reduce(function (reduced, attribute) {
            return reduced + " ".concat(attribute.name, "=\"").concat(attribute.value, "\"");
        }, '') +
        (node.childNodes.length ? '>' +
            Array.from(node.childNodes).reduce(function (reduced, child) {
                return reduced +
                    (child.nodeType === node.ELEMENT_NODE ?
                        serialiseToString(child) :
                        child.textContent);
            }, '') + "</".concat(tagName, ">")
            : '/>');
};
var doctypeToString = function (doctype) {
    return "<!DOCTYPE ".concat(doctype.name).concat(doctype.publicId ? " PUBLIC \"".concat(doctype.publicId, "\"") : '').concat(!doctype.publicId && doctype.systemId ? ' SYSTEM' : '').concat(doctype.systemId ? " \"".concat(doctype.systemId, "\"") : '', " >");
};

var StringFormatGuide;
(function (StringFormatGuide) {
    StringFormatGuide["default"] = "default";
    StringFormatGuide["cjkPunc"] = "cjk-punc";
    StringFormatGuide["fullwidthAlphabet"] = "fullwidth-alphabet";
    StringFormatGuide["latin"] = "latin";
    StringFormatGuide["kana"] = "kana";
    StringFormatGuide["ambiguous"] = "ambiguous";
})(StringFormatGuide || (StringFormatGuide = {}));

String.prototype.segmentise = function (re) {
    let str = String(this);
    let segments = [];
    let index = 0;
    let match;
    while (match = re.exec(str)) {
        if (match.index > index) {
            segments.push({
                content: str.substring(index, match.index),
                formatGuide: StringFormatGuide.default
            });
        }
        let formatGuide;
        if (match[1]) {
            formatGuide = StringFormatGuide.ambiguous;
        }
        else if (match[2]) {
            formatGuide = StringFormatGuide.cjkPunc;
        }
        else if (match[3]) {
            formatGuide = StringFormatGuide.fullwidthAlphabet;
        }
        else if (match[4]) {
            formatGuide = StringFormatGuide.latin;
        }
        else if (match[5]) {
            formatGuide = StringFormatGuide.kana;
        }
        else {
            formatGuide = StringFormatGuide.default;
        }
        segments.push({
            content: match[0],
            formatGuide: formatGuide
        });
        index = match.index + match[0].length;
    }
    if (str.length > index) {
        segments.push({
            content: str.substring(index),
            formatGuide: StringFormatGuide.default
        });
    }
    return segments;
};

class Tategaki {
    constructor(rootElement, config, __document) {
        this.correctPuncs = (text) => text.replace(/──/g, '――')
            .replace(/—/g, '―')
            .replace(/……/g, '⋯⋯')
            .replace(/！！|\!\!/g, '‼')
            .replace(/？？|\?\?/g, '⁇')
            .replace(/？！|\?\!/g, '⁈')
            .replace(/！？|\!\?/g, '⁉');
        this.rootElement = rootElement;
        const defaultConfig = {
            shouldPcS: true,
            imitatePcS: true,
            imitatePcFwid: true,
            shouldAdjustOrphanLine: false,
            shouldRemoveStyle: false,
            convertNewlineCustom: false
        };
        this.config = Object.assign({}, defaultConfig, config);
        this.document = __document ?? document;
    }
    parse() {
        this.rootElement.classList.add('tategaki');
        this.rootElement.classList.add(this.config.imitatePcS ? 'imitate-pcs' : 'opentype-pcs');
        if (this.config.shouldRemoveStyle) {
            this.removeStyle();
        }
        this.format(this.rootElement);
        this.tcy();
        this.correctAmbiguous();
        if (this.config.shouldAdjustOrphanLine) {
            this.insertWordJoiner();
        }
    }
    insertWordJoiner() {
        let paras = Array.from(this.rootElement.querySelectorAll('p:not(.original-post)'));
        paras.forEach(para => {
            let children = para.children;
            if (children.length < 2) {
                return;
            }
            let lastButOneSpan = children[children.length - 2];
            let re = /[\p{Script_Extensions=Han}\p{Script_Extensions=Hiragana}\p{Script_Extensions=Katakana}]{2}$/gu;
            if ((lastButOneSpan.classList.length === 0 || lastButOneSpan.classList.contains('kana')) &&
                re.test(lastButOneSpan.innerHTML)) {
                let text = lastButOneSpan.innerHTML;
                lastButOneSpan.innerHTML =
                    text.slice(0, -1) + '&NoBreak;' + text.slice(-1, text.length);
            }
        });
    }
    setElementAttributes(element, segment) {
        switch (segment.formatGuide) {
            case StringFormatGuide.default: {
                element.innerHTML = this.postProcess(segment.content);
                return;
            }
            case StringFormatGuide.latin: {
                element.setAttribute('lang', 'en');
                element.setAttribute('title', segment.content);
                break;
            }
            case StringFormatGuide.kana: {
                element.setAttribute('lang', 'jp');
                break;
            }
            case StringFormatGuide.cjkPunc: {
                if (this.config.shouldPcS) {
                    element.innerHTML = this.squeeze(segment.content);
                }
                break;
            }
        }
        element.classList.add(segment.formatGuide);
    }
    postProcess(text) {
        if (this.config.convertNewlineCustom) {
            text = text.replace(/\n[ \n]*/g, `<br /><span class="indent"></span>`);
        }
        return text;
    }
    format(node, passUntilPara = true) {
        if (node.nodeType === this.document.TEXT_NODE) {
            let text = node.nodeValue;
            if (text && !text.trim()) {
                return;
            }
            text = this.correctPuncs(text);
            let re = /([\u002f\u2013]+|――)|([\u203c\u2047-\u2049\u3001\u3002\u301d\u301f\uff01\uff0c\uff1a\uff1b\uff1f\u3008-\u3011\u3014-\u301B\uff08\uff09]+)|([\uff21-\uff3a\uff41-\uff5a]+)|([\p{Script=Latin}0-9\u0020-\u0023\u0025-\u002b\u002c-\u002e\u003a\u003b\u003f\u0040\u005b-\u005d\u005f\u007b\u007d\u00a0\u00a1\u00a7\u00ab\u00b2\u00b3\u00b6\u00b7\u00b9\u00bb-\u00bf\u2010-\u2012\u2018\u2019\u201c\u201d\u2020\u2021\u2026\u2027\u2030\u2032-\u2037\u2039\u203a\u203d-\u203e\u204e\u2057\u2070\u2074-\u2079\u2080-\u2089\u2150\u2153\u2154\u215b-\u215e\u2160-\u217f\u2474-\u249b\u2e18\u2e2e]+)|([\u3041-\u309f\u30a0-\u30fa\u30fc\u30ff]+)/gu;
            let segments = text.segmentise(re);
            let parentElement = node.parentElement;
            if (!parentElement.childElementCount && segments.length === 1) {
                this.setElementAttributes(parentElement, segments[0]);
            }
            else {
                segments.forEach(segment => {
                    let subElement = this.document.createElement('span');
                    subElement.innerHTML = segment.content;
                    this.setElementAttributes(subElement, segment);
                    parentElement.insertBefore(subElement, node);
                });
                parentElement.removeChild(node);
            }
            return;
        }
        if (node.nodeName == 'BR') {
            let parentElement = node.parentElement;
            if (parentElement) {
                const br = this.document.createElement('br');
                let span = this.document.createElement('span');
                span.classList.add('indent');
                parentElement.insertBefore(br, node);
                parentElement.insertBefore(span, node);
                parentElement.removeChild(node);
            }
            return;
        }
        const IGNORE_TAGS = ['BR', 'RUBY', 'PRE', 'CODE', 'IMG'];
        if (IGNORE_TAGS.indexOf(node.nodeName) !== -1) {
            return;
        }
        const isPara = node.nodeName === 'P' || node.nodeName === 'BLOCKQUOTE';
        Array.from(node.childNodes).forEach(childNode => {
            this.format(childNode, isPara ? false : passUntilPara);
        });
    }
    removeStyle(element = this.rootElement) {
        element.removeAttribute('style');
        element.removeAttribute('width');
        element.removeAttribute('height');
        Array.from(element.children, child => {
            this.removeStyle(child);
        });
    }
    squeeze(puncs) {
        return puncs.split('').map(punc => {
            if (/[\u203c\u2047-\u2049\u3001\u3002\uff0c\uff01\uff1a\uff1b\uff1f]/.test(punc)) {
                return `<span class="squeeze-other-punc">${punc}</span>`;
            }
            const isOpeningBracket = punc === '\u301d' || punc.charCodeAt(0) % 2 === 0;
            const squeezeClass = isOpeningBracket ? 'squeeze-in' : 'squeeze-out';
            let result = `<span class="${squeezeClass}">${punc}</span>`;
            if (!this.config.imitatePcS) {
                return result;
            }
            if (isOpeningBracket) {
                return `<span class="squeeze-in-space"></span>` + result;
            }
            else {
                return result + `<span class="squeeze-out-space"></span>`;
            }
        }).join('');
    }
    transfromToFullWidth(x) {
        const base = '0'.charCodeAt(0);
        const newBase = '\uff10'.charCodeAt(0);
        const current = x.charCodeAt(0);
        return String.fromCharCode(current - base + newBase);
    }
    tcy() {
        let elements = Array.from(this.rootElement.getElementsByClassName(StringFormatGuide.latin));
        elements.forEach(element => {
            const text = element.innerHTML.trim();
            if (element.previousElementSibling &&
                element.previousElementSibling.classList.contains(StringFormatGuide.ambiguous) ||
                element.nextElementSibling &&
                    element.nextElementSibling.classList.contains(StringFormatGuide.ambiguous)) {
                return;
            }
            if (/^[\w\p{Script=Latin}]/u.test(text) &&
                element.nodeName != 'I' &&
                element.nodeName != 'EM' &&
                (!element.parentElement ||
                    element.parentElement &&
                        element.parentElement.nodeName != 'I' &&
                        element.parentElement.nodeName != 'EM')) {
                if (text.length == 1) {
                    if (this.config.imitatePcFwid) {
                        element.innerHTML = this.transfromToFullWidth(text);
                    }
                    else {
                        element.innerHTML = text;
                        element.classList.add('full-width');
                    }
                    element.classList.add('tcy-single');
                    element.classList.remove('latin');
                    element.removeAttribute('lang');
                    element.removeAttribute('title');
                }
                else if (/^([A-Z]{3,10}|\d{4,10})$/.test(text)) {
                    if (this.config.imitatePcFwid) {
                        element.innerHTML = Array.from(text, x => this.transfromToFullWidth(x)).join('');
                    }
                    else {
                        element.innerHTML = text;
                        element.classList.add('full-width');
                    }
                    element.classList.add('tcy-single');
                    element.classList.remove('latin');
                    element.removeAttribute('lang');
                    element.removeAttribute('title');
                }
                else if (/^[A-Z]{2}$|^\d{2,3}$/.test(text)) {
                    element.innerHTML = text;
                    element.classList.remove('latin');
                    element.removeAttribute('lang');
                    element.removeAttribute('title');
                    element.classList.add('tcy');
                }
                else if (/^\d{1,3}%$/.test(text)) {
                    const matches = /^(\d{1,3})%$/.exec(text);
                    let newElement = this.document.createElement('span');
                    let digit = matches[1];
                    if (digit.length === 1) {
                        digit = this.transfromToFullWidth(digit);
                    }
                    newElement.innerHTML = `<span ${digit.length == 1 ? '' : 'class="tcy"'}>${digit}</span>&NoBreak;％`;
                    element.replaceWith(newElement);
                }
            }
        });
    }
    correctAmbiguous() {
        Array.from(this.rootElement.getElementsByClassName(StringFormatGuide.ambiguous), element => {
            if (element.innerHTML === '――') {
                element.classList.add('aalt-on');
                element.classList.add(StringFormatGuide.cjkPunc);
                return;
            }
            if (!element.previousElementSibling || !element.nextElementSibling) {
                element.classList.add(StringFormatGuide.latin);
                return;
            }
            if (element.previousElementSibling.classList.contains(StringFormatGuide.latin) &&
                element.nextElementSibling.classList.contains(StringFormatGuide.latin)) {
                element.classList.add(StringFormatGuide.latin);
                return;
            }
            switch (element.innerHTML) {
                case '/': {
                    element.innerHTML = '／';
                    break;
                }
                case '–': {
                    element.innerHTML = '―';
                    break;
                }
            }
        });
    }
}

function extend (destination) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (source.hasOwnProperty(key)) destination[key] = source[key];
    }
  }
  return destination
}

function repeat (character, count) {
  return Array(count + 1).join(character)
}

function trimLeadingNewlines (string) {
  return string.replace(/^\n*/, '')
}

function trimTrailingNewlines (string) {
  // avoid match-at-end regexp bottleneck, see #370
  var indexEnd = string.length;
  while (indexEnd > 0 && string[indexEnd - 1] === '\n') indexEnd--;
  return string.substring(0, indexEnd)
}

var blockElements = [
  'ADDRESS', 'ARTICLE', 'ASIDE', 'AUDIO', 'BLOCKQUOTE', 'BODY', 'CANVAS',
  'CENTER', 'DD', 'DIR', 'DIV', 'DL', 'DT', 'FIELDSET', 'FIGCAPTION', 'FIGURE',
  'FOOTER', 'FORM', 'FRAMESET', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER',
  'HGROUP', 'HR', 'HTML', 'ISINDEX', 'LI', 'MAIN', 'MENU', 'NAV', 'NOFRAMES',
  'NOSCRIPT', 'OL', 'OUTPUT', 'P', 'PRE', 'SECTION', 'TABLE', 'TBODY', 'TD',
  'TFOOT', 'TH', 'THEAD', 'TR', 'UL'
];

function isBlock (node) {
  return is(node, blockElements)
}

var voidElements = [
  'AREA', 'BASE', 'BR', 'COL', 'COMMAND', 'EMBED', 'HR', 'IMG', 'INPUT',
  'KEYGEN', 'LINK', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR'
];

function isVoid (node) {
  return is(node, voidElements)
}

function hasVoid (node) {
  return has(node, voidElements)
}

var meaningfulWhenBlankElements = [
  'A', 'TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TH', 'TD', 'IFRAME', 'SCRIPT',
  'AUDIO', 'VIDEO'
];

function isMeaningfulWhenBlank (node) {
  return is(node, meaningfulWhenBlankElements)
}

function hasMeaningfulWhenBlank (node) {
  return has(node, meaningfulWhenBlankElements)
}

function is (node, tagNames) {
  return tagNames.indexOf(node.nodeName) >= 0
}

function has (node, tagNames) {
  return (
    node.getElementsByTagName &&
    tagNames.some(function (tagName) {
      return node.getElementsByTagName(tagName).length
    })
  )
}

var rules = {};

rules.paragraph = {
  filter: 'p',

  replacement: function (content) {
    return '\n\n' + content + '\n\n'
  }
};

rules.lineBreak = {
  filter: 'br',

  replacement: function (content, node, options) {
    return options.br + '\n'
  }
};

rules.heading = {
  filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],

  replacement: function (content, node, options) {
    var hLevel = Number(node.nodeName.charAt(1));

    if (options.headingStyle === 'setext' && hLevel < 3) {
      var underline = repeat((hLevel === 1 ? '=' : '-'), content.length);
      return (
        '\n\n' + content + '\n' + underline + '\n\n'
      )
    } else {
      return '\n\n' + repeat('#', hLevel) + ' ' + content + '\n\n'
    }
  }
};

rules.blockquote = {
  filter: 'blockquote',

  replacement: function (content) {
    content = content.replace(/^\n+|\n+$/g, '');
    content = content.replace(/^/gm, '> ');
    return '\n\n' + content + '\n\n'
  }
};

rules.list = {
  filter: ['ul', 'ol'],

  replacement: function (content, node) {
    var parent = node.parentNode;
    if (parent.nodeName === 'LI' && parent.lastElementChild === node) {
      return '\n' + content
    } else {
      return '\n\n' + content + '\n\n'
    }
  }
};

rules.listItem = {
  filter: 'li',

  replacement: function (content, node, options) {
    content = content
      .replace(/^\n+/, '') // remove leading newlines
      .replace(/\n+$/, '\n') // replace trailing newlines with just a single one
      .replace(/\n/gm, '\n    '); // indent
    var prefix = options.bulletListMarker + '   ';
    var parent = node.parentNode;
    if (parent.nodeName === 'OL') {
      var start = parent.getAttribute('start');
      var index = Array.prototype.indexOf.call(parent.children, node);
      prefix = (start ? Number(start) + index : index + 1) + '.  ';
    }
    return (
      prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : '')
    )
  }
};

rules.indentedCodeBlock = {
  filter: function (node, options) {
    return (
      options.codeBlockStyle === 'indented' &&
      node.nodeName === 'PRE' &&
      node.firstChild &&
      node.firstChild.nodeName === 'CODE'
    )
  },

  replacement: function (content, node, options) {
    return (
      '\n\n    ' +
      node.firstChild.textContent.replace(/\n/g, '\n    ') +
      '\n\n'
    )
  }
};

rules.fencedCodeBlock = {
  filter: function (node, options) {
    return (
      options.codeBlockStyle === 'fenced' &&
      node.nodeName === 'PRE' &&
      node.firstChild &&
      node.firstChild.nodeName === 'CODE'
    )
  },

  replacement: function (content, node, options) {
    var className = node.firstChild.getAttribute('class') || '';
    var language = (className.match(/language-(\S+)/) || [null, ''])[1];
    var code = node.firstChild.textContent;

    var fenceChar = options.fence.charAt(0);
    var fenceSize = 3;
    var fenceInCodeRegex = new RegExp('^' + fenceChar + '{3,}', 'gm');

    var match;
    while ((match = fenceInCodeRegex.exec(code))) {
      if (match[0].length >= fenceSize) {
        fenceSize = match[0].length + 1;
      }
    }

    var fence = repeat(fenceChar, fenceSize);

    return (
      '\n\n' + fence + language + '\n' +
      code.replace(/\n$/, '') +
      '\n' + fence + '\n\n'
    )
  }
};

rules.horizontalRule = {
  filter: 'hr',

  replacement: function (content, node, options) {
    return '\n\n' + options.hr + '\n\n'
  }
};

rules.inlineLink = {
  filter: function (node, options) {
    return (
      options.linkStyle === 'inlined' &&
      node.nodeName === 'A' &&
      node.getAttribute('href')
    )
  },

  replacement: function (content, node) {
    var href = node.getAttribute('href');
    var title = cleanAttribute(node.getAttribute('title'));
    if (title) title = ' "' + title + '"';
    return '[' + content + '](' + href + title + ')'
  }
};

rules.referenceLink = {
  filter: function (node, options) {
    return (
      options.linkStyle === 'referenced' &&
      node.nodeName === 'A' &&
      node.getAttribute('href')
    )
  },

  replacement: function (content, node, options) {
    var href = node.getAttribute('href');
    var title = cleanAttribute(node.getAttribute('title'));
    if (title) title = ' "' + title + '"';
    var replacement;
    var reference;

    switch (options.linkReferenceStyle) {
      case 'collapsed':
        replacement = '[' + content + '][]';
        reference = '[' + content + ']: ' + href + title;
        break
      case 'shortcut':
        replacement = '[' + content + ']';
        reference = '[' + content + ']: ' + href + title;
        break
      default:
        var id = this.references.length + 1;
        replacement = '[' + content + '][' + id + ']';
        reference = '[' + id + ']: ' + href + title;
    }

    this.references.push(reference);
    return replacement
  },

  references: [],

  append: function (options) {
    var references = '';
    if (this.references.length) {
      references = '\n\n' + this.references.join('\n') + '\n\n';
      this.references = []; // Reset references
    }
    return references
  }
};

rules.emphasis = {
  filter: ['em', 'i'],

  replacement: function (content, node, options) {
    if (!content.trim()) return ''
    return options.emDelimiter + content + options.emDelimiter
  }
};

rules.strong = {
  filter: ['strong', 'b'],

  replacement: function (content, node, options) {
    if (!content.trim()) return ''
    return options.strongDelimiter + content + options.strongDelimiter
  }
};

rules.code = {
  filter: function (node) {
    var hasSiblings = node.previousSibling || node.nextSibling;
    var isCodeBlock = node.parentNode.nodeName === 'PRE' && !hasSiblings;

    return node.nodeName === 'CODE' && !isCodeBlock
  },

  replacement: function (content) {
    if (!content) return ''
    content = content.replace(/\r?\n|\r/g, ' ');

    var extraSpace = /^`|^ .*?[^ ].* $|`$/.test(content) ? ' ' : '';
    var delimiter = '`';
    var matches = content.match(/`+/gm) || [];
    while (matches.indexOf(delimiter) !== -1) delimiter = delimiter + '`';

    return delimiter + extraSpace + content + extraSpace + delimiter
  }
};

rules.image = {
  filter: 'img',

  replacement: function (content, node) {
    var alt = cleanAttribute(node.getAttribute('alt'));
    var src = node.getAttribute('src') || '';
    var title = cleanAttribute(node.getAttribute('title'));
    var titlePart = title ? ' "' + title + '"' : '';
    return src ? '![' + alt + ']' + '(' + src + titlePart + ')' : ''
  }
};

function cleanAttribute (attribute) {
  return attribute ? attribute.replace(/(\n+\s*)+/g, '\n') : ''
}

/**
 * Manages a collection of rules used to convert HTML to Markdown
 */

function Rules (options) {
  this.options = options;
  this._keep = [];
  this._remove = [];

  this.blankRule = {
    replacement: options.blankReplacement
  };

  this.keepReplacement = options.keepReplacement;

  this.defaultRule = {
    replacement: options.defaultReplacement
  };

  this.array = [];
  for (var key in options.rules) this.array.push(options.rules[key]);
}

Rules.prototype = {
  add: function (key, rule) {
    this.array.unshift(rule);
  },

  keep: function (filter) {
    this._keep.unshift({
      filter: filter,
      replacement: this.keepReplacement
    });
  },

  remove: function (filter) {
    this._remove.unshift({
      filter: filter,
      replacement: function () {
        return ''
      }
    });
  },

  forNode: function (node) {
    if (node.isBlank) return this.blankRule
    var rule;

    if ((rule = findRule(this.array, node, this.options))) return rule
    if ((rule = findRule(this._keep, node, this.options))) return rule
    if ((rule = findRule(this._remove, node, this.options))) return rule

    return this.defaultRule
  },

  forEach: function (fn) {
    for (var i = 0; i < this.array.length; i++) fn(this.array[i], i);
  }
};

function findRule (rules, node, options) {
  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i];
    if (filterValue(rule, node, options)) return rule
  }
  return void 0
}

function filterValue (rule, node, options) {
  var filter = rule.filter;
  if (typeof filter === 'string') {
    if (filter === node.nodeName.toLowerCase()) return true
  } else if (Array.isArray(filter)) {
    if (filter.indexOf(node.nodeName.toLowerCase()) > -1) return true
  } else if (typeof filter === 'function') {
    if (filter.call(rule, node, options)) return true
  } else {
    throw new TypeError('`filter` needs to be a string, array, or function')
  }
}

/**
 * The collapseWhitespace function is adapted from collapse-whitespace
 * by Luc Thevenard.
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Luc Thevenard <lucthevenard@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * collapseWhitespace(options) removes extraneous whitespace from an the given element.
 *
 * @param {Object} options
 */
function collapseWhitespace (options) {
  var element = options.element;
  var isBlock = options.isBlock;
  var isVoid = options.isVoid;
  var isPre = options.isPre || function (node) {
    return node.nodeName === 'PRE'
  };

  if (!element.firstChild || isPre(element)) return

  var prevText = null;
  var keepLeadingWs = false;

  var prev = null;
  var node = next(prev, element, isPre);

  while (node !== element) {
    if (node.nodeType === 3 || node.nodeType === 4) { // Node.TEXT_NODE or Node.CDATA_SECTION_NODE
      var text = node.data.replace(/[ \r\n\t]+/g, ' ');

      if ((!prevText || / $/.test(prevText.data)) &&
          !keepLeadingWs && text[0] === ' ') {
        text = text.substr(1);
      }

      // `text` might be empty at this point.
      if (!text) {
        node = remove(node);
        continue
      }

      node.data = text;

      prevText = node;
    } else if (node.nodeType === 1) { // Node.ELEMENT_NODE
      if (isBlock(node) || node.nodeName === 'BR') {
        if (prevText) {
          prevText.data = prevText.data.replace(/ $/, '');
        }

        prevText = null;
        keepLeadingWs = false;
      } else if (isVoid(node) || isPre(node)) {
        // Avoid trimming space around non-block, non-BR void elements and inline PRE.
        prevText = null;
        keepLeadingWs = true;
      } else if (prevText) {
        // Drop protection if set previously.
        keepLeadingWs = false;
      }
    } else {
      node = remove(node);
      continue
    }

    var nextNode = next(prev, node, isPre);
    prev = node;
    node = nextNode;
  }

  if (prevText) {
    prevText.data = prevText.data.replace(/ $/, '');
    if (!prevText.data) {
      remove(prevText);
    }
  }
}

/**
 * remove(node) removes the given node from the DOM and returns the
 * next node in the sequence.
 *
 * @param {Node} node
 * @return {Node} node
 */
function remove (node) {
  var next = node.nextSibling || node.parentNode;

  node.parentNode.removeChild(node);

  return next
}

/**
 * next(prev, current, isPre) returns the next node in the sequence, given the
 * current and previous nodes.
 *
 * @param {Node} prev
 * @param {Node} current
 * @param {Function} isPre
 * @return {Node}
 */
function next (prev, current, isPre) {
  if ((prev && prev.parentNode === current) || isPre(current)) {
    return current.nextSibling || current.parentNode
  }

  return current.firstChild || current.nextSibling || current.parentNode
}

/*
 * Set up window for Node.js
 */

var root = (typeof window !== 'undefined' ? window : {});

/*
 * Parsing HTML strings
 */

function canParseHTMLNatively () {
  var Parser = root.DOMParser;
  var canParse = false;

  // Adapted from https://gist.github.com/1129031
  // Firefox/Opera/IE throw errors on unsupported types
  try {
    // WebKit returns null on unsupported types
    if (new Parser().parseFromString('', 'text/html')) {
      canParse = true;
    }
  } catch (e) {}

  return canParse
}

function createHTMLParser () {
  var Parser = function () {};

  {
    var domino = require('domino');
    Parser.prototype.parseFromString = function (string) {
      return domino.createDocument(string)
    };
  }
  return Parser
}

var HTMLParser = canParseHTMLNatively() ? root.DOMParser : createHTMLParser();

function RootNode (input, options) {
  var root;
  if (typeof input === 'string') {
    var doc = htmlParser().parseFromString(
      // DOM parsers arrange elements in the <head> and <body>.
      // Wrapping in a custom element ensures elements are reliably arranged in
      // a single element.
      '<x-turndown id="turndown-root">' + input + '</x-turndown>',
      'text/html'
    );
    root = doc.getElementById('turndown-root');
  } else {
    root = input.cloneNode(true);
  }
  collapseWhitespace({
    element: root,
    isBlock: isBlock,
    isVoid: isVoid,
    isPre: options.preformattedCode ? isPreOrCode : null
  });

  return root
}

var _htmlParser;
function htmlParser () {
  _htmlParser = _htmlParser || new HTMLParser();
  return _htmlParser
}

function isPreOrCode (node) {
  return node.nodeName === 'PRE' || node.nodeName === 'CODE'
}

function Node (node, options) {
  node.isBlock = isBlock(node);
  node.isCode = node.nodeName === 'CODE' || node.parentNode.isCode;
  node.isBlank = isBlank(node);
  node.flankingWhitespace = flankingWhitespace(node, options);
  return node
}

function isBlank (node) {
  return (
    !isVoid(node) &&
    !isMeaningfulWhenBlank(node) &&
    /^\s*$/i.test(node.textContent) &&
    !hasVoid(node) &&
    !hasMeaningfulWhenBlank(node)
  )
}

function flankingWhitespace (node, options) {
  if (node.isBlock || (options.preformattedCode && node.isCode)) {
    return { leading: '', trailing: '' }
  }

  var edges = edgeWhitespace(node.textContent);

  // abandon leading ASCII WS if left-flanked by ASCII WS
  if (edges.leadingAscii && isFlankedByWhitespace('left', node, options)) {
    edges.leading = edges.leadingNonAscii;
  }

  // abandon trailing ASCII WS if right-flanked by ASCII WS
  if (edges.trailingAscii && isFlankedByWhitespace('right', node, options)) {
    edges.trailing = edges.trailingNonAscii;
  }

  return { leading: edges.leading, trailing: edges.trailing }
}

function edgeWhitespace (string) {
  var m = string.match(/^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/);
  return {
    leading: m[1], // whole string for whitespace-only strings
    leadingAscii: m[2],
    leadingNonAscii: m[3],
    trailing: m[4], // empty for whitespace-only strings
    trailingNonAscii: m[5],
    trailingAscii: m[6]
  }
}

function isFlankedByWhitespace (side, node, options) {
  var sibling;
  var regExp;
  var isFlanked;

  if (side === 'left') {
    sibling = node.previousSibling;
    regExp = / $/;
  } else {
    sibling = node.nextSibling;
    regExp = /^ /;
  }

  if (sibling) {
    if (sibling.nodeType === 3) {
      isFlanked = regExp.test(sibling.nodeValue);
    } else if (options.preformattedCode && sibling.nodeName === 'CODE') {
      isFlanked = false;
    } else if (sibling.nodeType === 1 && !isBlock(sibling)) {
      isFlanked = regExp.test(sibling.textContent);
    }
  }
  return isFlanked
}

var reduce = Array.prototype.reduce;
var escapes = [
  [/\\/g, '\\\\'],
  [/\*/g, '\\*'],
  [/^-/g, '\\-'],
  [/^\+ /g, '\\+ '],
  [/^(=+)/g, '\\$1'],
  [/^(#{1,6}) /g, '\\$1 '],
  [/`/g, '\\`'],
  [/^~~~/g, '\\~~~'],
  [/\[/g, '\\['],
  [/\]/g, '\\]'],
  [/^>/g, '\\>'],
  [/_/g, '\\_'],
  [/^(\d+)\. /g, '$1\\. ']
];

function TurndownService (options) {
  if (!(this instanceof TurndownService)) return new TurndownService(options)

  var defaults = {
    rules: rules,
    headingStyle: 'setext',
    hr: '* * *',
    bulletListMarker: '*',
    codeBlockStyle: 'indented',
    fence: '```',
    emDelimiter: '_',
    strongDelimiter: '**',
    linkStyle: 'inlined',
    linkReferenceStyle: 'full',
    br: '  ',
    preformattedCode: false,
    blankReplacement: function (content, node) {
      return node.isBlock ? '\n\n' : ''
    },
    keepReplacement: function (content, node) {
      return node.isBlock ? '\n\n' + node.outerHTML + '\n\n' : node.outerHTML
    },
    defaultReplacement: function (content, node) {
      return node.isBlock ? '\n\n' + content + '\n\n' : content
    }
  };
  this.options = extend({}, defaults, options);
  this.rules = new Rules(this.options);
}

TurndownService.prototype = {
  /**
   * The entry point for converting a string or DOM node to Markdown
   * @public
   * @param {String|HTMLElement} input The string or DOM node to convert
   * @returns A Markdown representation of the input
   * @type String
   */

  turndown: function (input) {
    if (!canConvert(input)) {
      throw new TypeError(
        input + ' is not a string, or an element/document/fragment node.'
      )
    }

    if (input === '') return ''

    var output = process.call(this, new RootNode(input, this.options));
    return postProcess.call(this, output)
  },

  /**
   * Add one or more plugins
   * @public
   * @param {Function|Array} plugin The plugin or array of plugins to add
   * @returns The Turndown instance for chaining
   * @type Object
   */

  use: function (plugin) {
    if (Array.isArray(plugin)) {
      for (var i = 0; i < plugin.length; i++) this.use(plugin[i]);
    } else if (typeof plugin === 'function') {
      plugin(this);
    } else {
      throw new TypeError('plugin must be a Function or an Array of Functions')
    }
    return this
  },

  /**
   * Adds a rule
   * @public
   * @param {String} key The unique key of the rule
   * @param {Object} rule The rule
   * @returns The Turndown instance for chaining
   * @type Object
   */

  addRule: function (key, rule) {
    this.rules.add(key, rule);
    return this
  },

  /**
   * Keep a node (as HTML) that matches the filter
   * @public
   * @param {String|Array|Function} filter The unique key of the rule
   * @returns The Turndown instance for chaining
   * @type Object
   */

  keep: function (filter) {
    this.rules.keep(filter);
    return this
  },

  /**
   * Remove a node that matches the filter
   * @public
   * @param {String|Array|Function} filter The unique key of the rule
   * @returns The Turndown instance for chaining
   * @type Object
   */

  remove: function (filter) {
    this.rules.remove(filter);
    return this
  },

  /**
   * Escapes Markdown syntax
   * @public
   * @param {String} string The string to escape
   * @returns A string with Markdown syntax escaped
   * @type String
   */

  escape: function (string) {
    return escapes.reduce(function (accumulator, escape) {
      return accumulator.replace(escape[0], escape[1])
    }, string)
  }
};

/**
 * Reduces a DOM node down to its Markdown string equivalent
 * @private
 * @param {HTMLElement} parentNode The node to convert
 * @returns A Markdown representation of the node
 * @type String
 */

function process (parentNode) {
  var self = this;
  return reduce.call(parentNode.childNodes, function (output, node) {
    node = new Node(node, self.options);

    var replacement = '';
    if (node.nodeType === 3) {
      replacement = node.isCode ? node.nodeValue : self.escape(node.nodeValue);
    } else if (node.nodeType === 1) {
      replacement = replacementForNode.call(self, node);
    }

    return join(output, replacement)
  }, '')
}

/**
 * Appends strings as each rule requires and trims the output
 * @private
 * @param {String} output The conversion output
 * @returns A trimmed version of the ouput
 * @type String
 */

function postProcess (output) {
  var self = this;
  this.rules.forEach(function (rule) {
    if (typeof rule.append === 'function') {
      output = join(output, rule.append(self.options));
    }
  });

  return output.replace(/^[\t\r\n]+/, '').replace(/[\t\r\n\s]+$/, '')
}

/**
 * Converts an element node to its Markdown equivalent
 * @private
 * @param {HTMLElement} node The node to convert
 * @returns A Markdown representation of the node
 * @type String
 */

function replacementForNode (node) {
  var rule = this.rules.forNode(node);
  var content = process.call(this, node);
  var whitespace = node.flankingWhitespace;
  if (whitespace.leading || whitespace.trailing) content = content.trim();
  return (
    whitespace.leading +
    rule.replacement(content, node, this.options) +
    whitespace.trailing
  )
}

/**
 * Joins replacement to the current output with appropriate number of new lines
 * @private
 * @param {String} output The current conversion output
 * @param {String} replacement The string to append to the output
 * @returns Joined output
 * @type String
 */

function join (output, replacement) {
  var s1 = trimTrailingNewlines(output);
  var s2 = trimLeadingNewlines(replacement);
  var nls = Math.max(output.length - s1.length, replacement.length - s2.length);
  var separator = '\n\n'.substring(0, nls);

  return s1 + separator + s2
}

/**
 * Determines whether an input can be converted
 * @private
 * @param {String|HTMLElement} input Describe this parameter
 * @returns Describe what it returns
 * @type String|Object|Array|Boolean|Number
 */

function canConvert (input) {
  return (
    input != null && (
      typeof input === 'string' ||
      (input.nodeType && (
        input.nodeType === 1 || input.nodeType === 9 || input.nodeType === 11
      ))
    )
  )
}

module.exports = require('./lib/');

var MarkdownIt = /*#__PURE__*/Object.freeze({
    __proto__: null
});

var argv = yargs(Deno.args).parse();
var tategakuEPUB = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pubStructure, _loop_1, _a, _b, _c, e_1_1;
    var _d, e_1, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, decompress(argv.i, 'tmp')];
            case 1:
                _g.sent();
                pubStructure = path.join('tmp', 'OEBPS');
                _g.label = 2;
            case 2:
                _g.trys.push([2, 7, 8, 13]);
                _loop_1 = function () {
                    _f = _c.value;
                    _a = false;
                    try {
                        var entry = _f;
                        if (!entry.path.endsWith('.xhtml')) {
                            return "continue";
                        }
                        var xhtmlPath = entry.path;
                        var xhtmlRaw = Deno.readTextFileSync(xhtmlPath);
                        var document_1 = new DOMParser().parseFromString(xhtmlRaw, 'text/html');
                        if (document_1) {
                            // TODO: Add option to keep original document structure
                            // Standardise 
                            var markdown = new TurndownService().turndown(document_1.body.innerHTML);
                            document_1.body.innerHTML = new MarkdownIt().render(markdown);
                            var tategaki = new Tategaki(document_1.body, {
                                shouldAdjustOrphanLine: true
                            }, document_1);
                            tategaki.parse();
                            // Remove `span`
                            // FIXME: It is a `Tategaki` bug after implementing `shouldAdjustOrphanLine`
                            Array.from(document_1.getElementsByTagName('span'))
                                .filter(function (span) { return !span.className; })
                                .forEach(function (span) {
                                var parentNode = span.parentNode;
                                if (!parentNode) {
                                    return;
                                }
                                if (span.textContent)
                                    parentNode.replaceChild(document_1.createTextNode(span.textContent), span);
                                else
                                    parentNode.removeChild(span);
                            });
                            Deno.writeTextFileSync(xhtmlPath, [xmlHeader,
                                doctypeToString(document_1.doctype),
                                serialiseToString(document_1.documentElement)
                            ].join('\n'));
                        }
                    }
                    finally {
                        _a = true;
                    }
                };
                _a = true, _b = __asyncValues(walk(pubStructure));
                _g.label = 3;
            case 3: return [4 /*yield*/, _b.next()];
            case 4:
                if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 6];
                _loop_1();
                _g.label = 5;
            case 5: return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 13];
            case 7:
                e_1_1 = _g.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 13];
            case 8:
                _g.trys.push([8, , 11, 12]);
                if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 10];
                return [4 /*yield*/, _e.call(_b)];
            case 9:
                _g.sent();
                _g.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 12: return [7 /*endfinally*/];
            case 13:
                Deno.chdir('tmp');
                return [4 /*yield*/, compress('.', path.join('..', argv.o), { overwrite: true, flags: ['-q'] })];
            case 14:
                _g.sent();
                Deno.chdir('..');
                return [4 /*yield*/, Deno.remove('tmp', { recursive: true })];
            case 15:
                _g.sent();
                return [2 /*return*/];
        }
    });
}); };
await tategakuEPUB();
