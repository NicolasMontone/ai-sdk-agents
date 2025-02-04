import { tool, type Tool } from 'ai'
import { z } from 'zod'

type PerplexityTools = 'search'

/**
  - sonar-reasoning-pro	127k	Chat Completion
  - sonar-reasoning	127k	Chat Completion
  - sonar-pro	200k	Chat Completion
  - sonar	127k	Chat Completion
 */
type PerplexityModel =
  | 'sonar-reasoning-pro'
  | 'sonar-reasoning'
  | 'sonar-pro'
  | 'sonar'

async function getAnswer({
  query,
  apiKey,
  model = 'sonar',
  maxTokens = 1000,
  systemPrompt = 'Be precise and concise.',
  temperature = 0.2,
  topP = 0.9,
  frequencyPenalty = 1,
}: {
  query: string
  apiKey: string
  model?: PerplexityModel
  maxTokens?: number
  systemPrompt?: string
  temperature?: number
  topP?: number
  frequencyPenalty?: number
}) {
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query },
      ],
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      max_tokens: maxTokens,
    }),
  })

  const data = await response.json()
  return {
    content: data.choices[0].message.content,
    citations: data.citations || []
  }
}

export const perplexityTools = (
  {
    apiKey,
    model = 'sonar',
    maxTokens,
    systemPrompt,
    temperature,
    topP,
    frequencyPenalty,
  }: {
    apiKey: string
    model?: PerplexityModel
    maxTokens?: number
    systemPrompt?: string
    temperature?: number
    topP?: number
    frequencyPenalty?: number
  },
  {
    excludeTools,
  }: {
    excludeTools?: PerplexityTools[]
  } = {}
): Partial<Record<PerplexityTools, Tool>> => {
  const tools: Partial<Record<PerplexityTools, Tool>> = {
    search: tool({
      description: 'Search the web for information',
      parameters: z.object({
        query: z.string().describe('The query to search for'),
      }),
      execute: async ({ query }) => {
        const { content, citations } = await getAnswer({
          query,
          apiKey,
          model,
          maxTokens,
          systemPrompt,
          temperature,
          topP,
          frequencyPenalty,
        })
        return { content, citations }
      },
    }),
  }

  for (const toolName in tools) {
    if (excludeTools?.includes(toolName as PerplexityTools)) {
      delete tools[toolName as PerplexityTools]
    }
  }

  return tools
}
