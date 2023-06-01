#!/usr/bin/env deno run --allow-read --allow-write --allow-run
import yargs from 'https://deno.land/x/yargs@v17.7.2-deno/deno.ts'

import { compress, decompress } from 'https://deno.land/x/zip@v1.2.5/mod.ts'
import path from 'node:path'
import { walk } from 'https://deno.land/std@0.170.0/fs/walk.ts'
import { DOMParser, Element } from 'https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts'
import { xmlHeader, doctypeToString, serialiseToString } from '../lib/serialise.ts'

import { Tategaki } from 'tategaki'
import TurndownService from 'turndown'
import * as MarkdownIt from 'markdown-it'


const argv = yargs(Deno.args).parse()

const tategakuEPUB = async () => {
    await decompress(argv.i, 'tmp')
    const pubStructure = path.join('tmp', 'OEBPS')
    for await (const entry of walk(pubStructure)) {
        if (!entry.path.endsWith('.xhtml')) { continue }

        const xhtmlPath = entry.path
        const xhtmlRaw = Deno.readTextFileSync(xhtmlPath)

        const document = new DOMParser().parseFromString(xhtmlRaw, 'text/html')
        if (document) {
            // TODO: Add option to keep original document structure
            // Standardise 
            const markdown = new TurndownService().turndown(document.body.innerHTML)
            document.body.innerHTML = new MarkdownIt().render(markdown)

            const tategaki = new Tategaki(document.body, {
                shouldAdjustOrphanLine: true
            }, document)
            tategaki.parse()

            // Remove `span`
            // FIXME: It is a `Tategaki` bug after implementing `shouldAdjustOrphanLine`
            Array.from(document.getElementsByTagName('span'))
                .filter((span: Element) => !span.className)
                .forEach((span: Element) => {
                    const parentNode = span.parentNode
                    if (!parentNode) { return }

                    if (span.textContent) 
                        parentNode.replaceChild(
                            document.createTextNode(span.textContent),
                            span
                        )
                    else parentNode.removeChild(span)
                })
            
            Deno.writeTextFileSync(xhtmlPath,
                [ xmlHeader
                , doctypeToString(document.doctype!)
                , serialiseToString(document.documentElement!)
                ].join('\n'))
        }
        
    }
    Deno.chdir('tmp')
    await compress('.', path.join('..', argv.o), { overwrite: true, flags: [ '-q' ] })
    Deno.chdir('..')
    await Deno.remove('tmp', { recursive: true })
}

await tategakuEPUB()
