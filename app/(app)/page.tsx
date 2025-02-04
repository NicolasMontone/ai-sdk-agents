'use client'
import { CLICommand } from '@/components/cli-command'
import { tools } from '../data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CodeBlock } from '@/components/code-block'
import { use } from 'react'
import { PenToolIcon as Tool, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ item?: string }>
}) {
  const itemKey = use(searchParams).item

  let data: {
    title: string
    description: string
    usage: string
    code: string
    tools: {
      title: string
      description: string
    }[]
  } = {
    title: 'AI SDK Tools Registry',
    description:
      'Welcome to the AI SDK Tools Registry - a comprehensive collection of ready-to-use tools and integrations for the Vercel AI SDK. This registry provides powerful components including search capabilities (Tavily, Perplexity), platform integrations (Discord, Slack, GitHub), and more. Each tool is designed to be easily installed via the shadcn CLI, allowing you to quickly enhance your AI-powered applications with production-ready features. Built with modern web technologies and styled using Shadcn UI components, these tools streamline the process of adding AI capabilities to your applications.',
    usage: '',
    code: '',
    tools: [],
  }

  if (itemKey && itemKey !== 'introduction') {
    const selectedTool = tools[itemKey as keyof typeof tools]
    if (selectedTool) {
      data = {
        title: selectedTool.name,
        description: selectedTool.description,
        usage: selectedTool.ui.usage,
        code: selectedTool.files[0].content,
        tools: selectedTool.ui.tools,
      }
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 container">
      <h1 className="text-2xl font-bold">
        {data.title.charAt(0).toUpperCase() + data.title.slice(1)}
      </h1>
      <p className="text-muted-foreground">{data.description}</p>
      {data.tools.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">Available Tools</h2>
          <p className="text-muted-foreground mb-4">
            This extension provides the following tools that can be used in your
            AI application:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.tools.map((tool) => (
              <div
                key={tool.title}
                className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Tool className="w-5 h-5 text-primary" />
                  <h3 className="font-medium text-lg">{tool.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {tool.description}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    AI SDK
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    Ready to use
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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
