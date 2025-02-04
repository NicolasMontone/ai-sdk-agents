'use client'
import dynamic from 'next/dynamic'
import { atomOneDark } from 'react-code-blocks'
import { Button } from './ui/button'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { useCallback, useState } from 'react'

const CodeBlockComponent = dynamic(
  () => import('react-code-blocks').then((mod) => mod.CodeBlock),
  {
    ssr: false,
  }
)

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    setCopied(true)
    navigator.clipboard.writeText(code)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }, [code])

  return (
    <div className="bg-background rounded-lg p-4 w-full overflow-hidden">
      <div className="flex flex-col w-full items-end justify-end">
        <Button onClick={handleCopy} variant="outline" size="icon">
          {copied ? <CheckIcon /> : <CopyIcon />}
        </Button>
      </div>
      <CodeBlockComponent
        text={code}
        language={'typescript'}
        // make the background transparent
        theme={{ ...atomOneDark, backgroundColor: '#27272a' }}
        showLineNumbers={true}
        codeContainerStyle={{
          maxHeight: '600px',
          maxWidth: '100%',
        }}
      />
    </div>
  )
}
