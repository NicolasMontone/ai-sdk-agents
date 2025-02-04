import { CLICommand } from '@/components/cli-command'
import { tools } from './data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CodeBlock } from '@/components/code-block'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ item?: string }>
}) {
  const itemKey = (await searchParams).item

  let data = {
    title: 'Welcome to AI SDK Tools',
    description:
      'Welcome to AI SDK Tools - a comprehensive collection of utility tools and integrations built for the Vercel AI SDK. This toolkit provides a variety of powerful tools including search capabilities (Tavily, Perplexity), mathematical operations, and platform integrations (Discord, Slack, GitHub). Built with modern web technologies and styled using Shadcn UI components, these tools are designed to enhance your AI-powered applications with ready-to-use functionalities. From database operations with PostgreSQL to advanced search capabilities and platform integrations, this toolkit simplifies the integration of AI features into your applications.',
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
    <div className="flex flex-1 flex-col gap-4 p-4">
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
            <TabsContent value="auto" className="mt-4">
              <CLICommand title={data.title} />
            </TabsContent>
            <TabsContent value="manual" className="mt-4">
              <div className="flex flex-col gap-2">
                <pre className="text-sm max-h-[600px] overflow-y-auto">
                  {data.code}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
      {data.usage && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">Usage</h2>
          <CodeBlock code={data.usage} />
        </div>
      )}
    </div>
  )
}
