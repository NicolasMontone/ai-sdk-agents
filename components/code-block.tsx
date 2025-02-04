'use client'

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypePrettyCode from 'rehype-pretty-code'
import type { Options } from 'rehype-pretty-code'
import { useState, useEffect } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { Button } from './ui/button'

interface CodeBlockProps {
  code: string
  language?: string
  theme?: string
  title?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
}

export function CodeBlock({
  code,
  language = 'typescript',
  theme = 'github-dark-dimmed',
  title,
  showLineNumbers = false,
  highlightLines = [],
}: CodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    highlightCode({
      code,
      language,
      theme,
      title,
      showLineNumbers,
      highlightLines,
    }).then(setHighlightedCode)
  }, [code, language, theme, title, showLineNumbers, highlightLines])

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  if (!highlightedCode) return <CodeBlockSkeleton />

  return (
    <div className="relative rounded-lg overflow-hidden container">
      {title && (
        <div className="px-4 py-2 text-sm text-gray-200 border-b border-gray-700/50 bg-[var(--shiki-dark-bg)]">
          {title}
        </div>
      )}
      <div className="flex items-center justify-end mb-2">
        <Button variant="outline" size="icon" onClick={handleCopy}>
          {copied ? (
            <CheckIcon className="w-4 h-4" />
          ) : (
            <CopyIcon className="w-4 h-4" />
          )}
        </Button>
      </div>
      <div
        className="text-sm max-w-full max-h-[600px] overflow-y-auto"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </div>
  )
}

async function highlightCode(props: CodeBlockProps) {
  const { code, language, theme, title, showLineNumbers, highlightLines } =
    props

  // Create meta string for the code block
  const meta = [
    highlightLines?.length ? `{${highlightLines.join(',')}}` : '',
    title ? `title="${title}"` : '',
    showLineNumbers ? 'showLineNumbers' : '',
  ]
    .filter(Boolean)
    .join(' ')

  // Create the code block with meta information
  const codeBlock = `\`\`\`${language}${
    meta ? ` ${meta}` : ''
  }\n${code}\n\`\`\``

  // Process the code through the unified pipeline
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme,
      keepBackground: true,
      defaultLang: language,
      grid: true,
    } as Options)
    .use(rehypeStringify)
    .process(codeBlock)

  return String(file)
}

export function CodeBlockSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-end mb-2">
        <Button variant="outline" size="icon" disabled>
          <CopyIcon className="w-4 h-4" />
        </Button>
      </div>
      <div className="w-full h-24 bg-gray-200/20 animate-pulse rounded-lg" />
    </div>
  )
}
