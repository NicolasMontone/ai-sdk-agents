import type { Metadata } from 'next'

import { Toaster } from '@/components/ui/toaster'

import { cn } from '@/lib/utils'

import type { ReactNode } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

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
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </header>
            {children}
            <Toaster />
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}
