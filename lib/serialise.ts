import { Element, DocumentType, Attr, Node } from 'https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts'

export const xmlHeader = `<?xml version="1.0" encoding="utf-8"?>`

export const serialiseToString = (node: Element): string => {
    const tagName = node.tagName.toLowerCase()
    return `<${tagName}` +
        Array.from(node.attributes).reduce((reduced, attribute: Attr) =>
            reduced + ` ${attribute.name}="${attribute.value}"`, '') + 
        (node.childNodes.length ? '>' +
            Array.from(node.childNodes).reduce((reduced, child: Node) =>
                reduced +
                    (child.nodeType === node.ELEMENT_NODE ?
                        serialiseToString(child as Element) :
                        child.textContent), '') + `</${tagName}>`
             : '/>')
}

export const doctypeToString = (doctype: DocumentType) =>
    `<!DOCTYPE ${doctype.name}\
${ doctype.publicId ? ` PUBLIC "${ doctype.publicId }"` : '' }\
${ !doctype.publicId && doctype.systemId ? ' SYSTEM' : '' }\
${ doctype.systemId ? ` "${ doctype.systemId }"` : '' } >`
