export function getPlainTextFromHtml(html = '') {
  if (!html) return ''
  if (typeof document === 'undefined') {
    return html.replace(/<[^>]*>/g, '').trim()
  }
  const element = document.createElement('div')
  element.innerHTML = html
  return element.textContent?.replace(/\u00a0/g, ' ').trim() || ''
}

export function isRichTextEmpty(html = '') {
  return !getPlainTextFromHtml(html)
}

const BLOCK_TAGS = new Set(['P', 'DIV', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE'])

function getClosestBlock(node, editor) {
  let current = node
  if (current?.nodeType === Node.TEXT_NODE) current = current.parentElement

  while (current && current !== editor) {
    if (BLOCK_TAGS.has(current.tagName)) return current
    current = current.parentElement
  }

  return null
}

export function getParagraphDirectionAtSelection(editor) {
  if (!editor) return 'rtl'

  const selection = window.getSelection()
  if (!selection?.rangeCount || !editor.contains(selection.anchorNode)) {
    return editor.getAttribute('dir') || 'rtl'
  }

  const block = getClosestBlock(selection.anchorNode, editor)
  if (block) {
    const dir = block.getAttribute('dir')
    if (dir === 'rtl' || dir === 'ltr') return dir
  }

  return editor.getAttribute('dir') || 'rtl'
}

export function applyParagraphDirection(editor, direction) {
  if (!editor || (direction !== 'rtl' && direction !== 'ltr')) return

  editor.focus()
  document.execCommand('dir', false, direction)

  const selection = window.getSelection()
  if (!selection?.rangeCount) return

  let block = getClosestBlock(selection.anchorNode, editor)

  if (!block) {
    document.execCommand('formatBlock', false, 'div')
    block = getClosestBlock(selection.anchorNode, editor)
  }

  if (block) {
    block.setAttribute('dir', direction)
    block.style.textAlign = direction === 'rtl' ? 'right' : 'left'
  }
}

export function applyRichTextCommand(editor, command, value = null) {
  if (!editor) return
  editor.focus()
  document.execCommand(command, false, value)
}

export function getRichTextActiveFormats(editor) {
  const paragraphDirection = getParagraphDirectionAtSelection(editor)

  try {
    return {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      unorderedList: document.queryCommandState('insertUnorderedList'),
      paragraphRtl: paragraphDirection === 'rtl',
      paragraphLtr: paragraphDirection === 'ltr',
    }
  } catch {
    return {
      bold: false,
      italic: false,
      underline: false,
      unorderedList: false,
      paragraphRtl: paragraphDirection === 'rtl',
      paragraphLtr: paragraphDirection === 'ltr',
    }
  }
}
