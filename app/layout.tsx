import type { Metadata } from 'next'

import { Toaster } from '@/components/ui/toaster'

import { cn } from '@/lib/utils'

import type { ReactNode } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'AI Agents',
  metadataBase: new URL('https://ai-agents.dev'),
  description: 'AI Agents',
  keywords: [
    'AI SDK',
    'shadcn/ui',
    'simple-ai',
    'AI Chatbot',
    'React',
    'Next.js',
    'Tailwind CSS',
    'TypeScript',
  ],
  authors: [
    {
      name: 'monto',
      url: 'https://nicolasmontone.com',
    },
  ],
  creator: 'monto',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={cn(
          'antialiased dark',
          geistSans.variable,
          geistMono.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
