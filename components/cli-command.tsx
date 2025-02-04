'use client'

import { CheckIcon, CopyIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'

export function CLICommand({ title }: { title: string }) {
  const [packageManager, setPackageManager] = useState<
    'npm' | 'yarn' | 'pnpm' | 'bun'
  >('pnpm')
  const [url, setUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(`${window.location.origin}/r/${title}`)
    }
  }, [title])

  const getCommand = () => {
    switch (packageManager) {
      case 'npm':
        return `npx shadcn@latest add ${url}.json`
      case 'yarn':
        return `npx shadcn@latest add ${url}.json`
      case 'pnpm':
        return `pnpm dlx shadcn@latest add ${url}.json`
      case 'bun':
        return `bunx --bun shadcn@latest add ${url}.json`
    }
  }

  const handleCopy = () => {
    setCopied(true)
    navigator.clipboard.writeText(getCommand())
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="relative max-w-fit">
      <div className="flex gap-2 mb-2">
        {(['pnpm', 'npm', 'yarn', 'bun'] as const).map((pm) => (
          <button
            key={pm}
            type="button"
            onClick={() => setPackageManager(pm)}
            className={`px-3 py-1 rounded cursor-pointer ${
              packageManager === pm ? 'bg-secondary' : ''
            }   ${!url ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!url}
          >
            {pm}
          </button>
        ))}
        <Button variant="outline" size="icon" onClick={handleCopy}>
          {copied ? <CheckIcon /> : <CopyIcon />}
        </Button>
      </div>
      <pre className="bg-secondary p-4 rounded-lg">
        {url ? (
          getCommand()
        ) : (
          <div className="bg-muted-foreground/20 w-80 rounded-md h-6 animate-pulse" />
        )}
      </pre>
    </div>
  )
}
