'use client'
import { CLICommand } from '@/components/cli-command'
import { tools } from '../data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CodeBlock } from '@/components/code-block'
import { use } from 'react'

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ item?: string }>
}) {
  const itemKey = use(searchParams).item

  let data = {
    title: 'AI SDK Tools Registry',
    description:
      'Welcome to the AI SDK Tools Registry - a comprehensive collection of ready-to-use tools and integrations for the Vercel AI SDK. This registry provides powerful components including search capabilities (Tavily, Perplexity), platform integrations (Discord, Slack, GitHub), and more. Each tool is designed to be easily installed via the shadcn CLI, allowing you to quickly enhance your AI-powered applications with production-ready features. Built with modern web technologies and styled using Shadcn UI components, these tools streamline the process of adding AI capabilities to your applications.',
    usage: '',
    code: '',
  }

  if (itemKey && itemKey !== 'introduction') {
    const selectedTool = tools[itemKey as keyof typeof tools]
    if (selectedTool) {
      data = {
        title: selectedTool.name,
        description: selectedTool.description,
        usage: selectedTool.ui.usage,
        code: selectedTool.files[0].content,
      }
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 container">
      <h1 className="text-2xl font-bold">
        {data.title.charAt(0).toUpperCase() + data.title.slice(1)}
      </h1>
      <p className="text-muted-foreground">{data.description}</p>
      {data.code && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">Installation</h2>
          <Tabs defaultValue={'auto'}>
            <TabsList>
              <TabsTrigger value="auto">Automatic (shadcn/ui cli)</TabsTrigger>
              <TabsTrigger value="manual">Manual (copy & paste)</TabsTrigger>
            </TabsList>
            <TabsContent value="auto" className="mt-4 container">
              <CLICommand title={data.title} />
            </TabsContent>
            <TabsContent value="manual" className="mt-4 container">
              <div className="flex flex-col gap-2">
                <CodeBlock code={data.code} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
      {data.usage && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">Usage</h2>
          <div className="flex flex-col gap-2">
            <CodeBlock code={data.usage} />
          </div>
        </div>
      )}
    </div>
  )
}
