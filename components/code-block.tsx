'use client'

import { useState } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { Button } from './ui/button'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
}

export function CodeBlock({
  code,
  language = 'typescript',
  title,
  showLineNumbers = false,
  highlightLines = [],
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  return (
    <div className="relative rounded-lg overflow-hidden w-full">
      {title && (
        <div className="px-4 py-2 text-sm text-gray-200 border-b border-gray-700/50 bg-[#1f2428]">
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
      <div className="text-sm max-w-full max-h-[600px] overflow-y-auto">
        <SyntaxHighlighter
          language={language}
          style={vs2015}
          showLineNumbers={showLineNumbers}
          wrapLines={true}
          lineProps={(lineNumber) => ({
            style: {
              backgroundColor: highlightLines.includes(lineNumber)
                ? '#2b3136'
                : undefined,
              display: 'block',
              width: '100%',
              wordBreak: 'break-all',
              whiteSpace: 'pre-wrap',
            },
          })}
          customStyle={{
            margin: 0,
            borderRadius: '0.5rem',
            background: '#1f2428',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
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
