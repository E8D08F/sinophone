#!/usr/bin/env deno run --allow-read --allow-write --allow-run
import yargs from 'https://deno.land/x/yargs@v17.7.2-deno/deno.ts';
import { compress, decompress } from 'https://deno.land/x/zip@v1.2.5/mod.ts';
import path from 'node:path';
import { walk } from 'https://deno.land/std@0.170.0/fs/walk.ts';
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts';
import TurndownService from 'npm:turndown';
import MarkdownIt from 'npm:markdown-it';

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
