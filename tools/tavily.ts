import { tool, type Tool } from 'ai'
import { z } from 'zod'
import { tavily } from '@tavily/core'

type TavilyTools = 'search' | 'searchContext' | 'searchQNA' | 'extract'

interface TavilyImage {
  url: string
  description?: string
}

interface TavilySearchResult {
  title: string
  url: string
  content: string
  rawContent?: string
  score: number
  publishedDate?: string
}

interface TavilySearchResponse {
  query: string
  answer?: string
  images?: TavilyImage[]
  results: TavilySearchResult[]
  responseTime: number
  error?: string // Added to handle errors
}

interface TavilyExtractResult {
  url: string
  rawContent: string
  images?: string[]
  error?: string
}

interface TavilyExtractResponse {
  results: TavilyExtractResult[]
  error?: string
}

export const tavilyTools = (
  { apiKey }: { apiKey: string },
  config?: {
    excludeTools?: TavilyTools[]
  }
): Partial<Record<TavilyTools, Tool>> => {
  const client = tavily({ apiKey })

  const tools: Partial<Record<TavilyTools, Tool>> = {
    search: tool({
      description:
        'Perform a comprehensive web search and get detailed results including optional images and AI-generated answers',
      parameters: z.object({
        query: z
          .string()
          .describe('The search query to find information about'),
        searchDepth: z
          .enum(['basic', 'advanced'])
          .optional()
          .describe(
            'Depth of search - basic is faster, advanced is more thorough'
          ),
        topic: z
          .enum(['general', 'news'])
          .optional()
          .describe(
            'Category of search - general for broad searches, news for recent events'
          ),
        days: z
          .number()
          .optional()
          .describe(
            'Number of days back to search (only works with news topic, defaults to 3)'
          ),
        timeRange: z
          .enum(['day', 'week', 'month', 'year', 'd', 'w', 'm', 'y'])
          .optional()
          .describe('Time range for results - alternative to days parameter'),
        maxResults: z
          .number()
          .optional()
          .describe('Maximum number of results to return (default: 5)'),
        includeImages: z
          .boolean()
          .optional()
          .describe('Include related images in the response'),
        includeImageDescriptions: z
          .boolean()
          .optional()
          .describe(
            'Add descriptive text for each image (requires includeImages)'
          ),
        includeAnswer: z
          .boolean()
          .optional()
          .describe(
            'Include AI-generated answer to query - basic is quick, advanced is detailed'
          ),
        includeRawContent: z
          .boolean()
          .optional()
          .describe('Include cleaned HTML content of each result'),
        includeDomains: z
          .array(z.string())
          .optional()
          .describe('List of domains to specifically include in results'),
        excludeDomains: z
          .array(z.string())
          .optional()
          .describe('List of domains to exclude from results'),
      }),
      execute: async ({ query, ...options }) => {
        try {
          return await client.search(query, {
            ...options,
          })
        } catch (error) {
          return { error: String(error) } as TavilySearchResponse
        }
      },
    }),
    searchContext: tool({
      description:
        'Search the web and get content and sources within a specified token limit, optimized for context retrieval',
      parameters: z.object({
        query: z
          .string()
          .describe('The search query to find information about'),
        maxTokens: z
          .number()
          .optional()
          .describe('Maximum number of tokens in the response (default: 4000)'),
        searchDepth: z
          .enum(['basic', 'advanced'])
          .optional()
          .describe(
            'Depth of search - basic is faster, advanced is more thorough'
          ),
        topic: z
          .enum(['general', 'news'])
          .optional()
          .describe(
            'Category of search - general for broad searches, news for recent events'
          ),
        days: z
          .number()
          .optional()
          .describe(
            'Number of days back to search (only works with news topic)'
          ),
        maxResults: z
          .number()
          .optional()
          .describe('Maximum number of results to return'),
        includeDomains: z
          .array(z.string())
          .optional()
          .describe('List of domains to specifically include in results'),
        excludeDomains: z
          .array(z.string())
          .optional()
          .describe('List of domains to exclude from results'),
      }),
      execute: async ({ query, ...options }) => {
        try {
          return await client.searchContext(query, options)
        } catch (error) {
          return String(error)
        }
      },
    }),
    searchQNA: tool({
      description:
        'Search the web and get a direct answer to your question, optimized for AI agent interactions',
      parameters: z.object({
        query: z.string().describe('The question to find an answer for'),
        searchDepth: z
          .enum(['basic', 'advanced'])
          .optional()
          .describe(
            'Depth of search - defaults to advanced for better answers'
          ),
        topic: z
          .enum(['general', 'news'])
          .optional()
          .describe(
            'Category of search - general for broad searches, news for recent events'
          ),
        days: z
          .number()
          .optional()
          .describe(
            'Number of days back to search (only works with news topic)'
          ),
        maxResults: z
          .number()
          .optional()
          .describe('Maximum number of results to consider'),
        includeDomains: z
          .array(z.string())
          .optional()
          .describe('List of domains to specifically include in results'),
        excludeDomains: z
          .array(z.string())
          .optional()
          .describe('List of domains to exclude from results'),
      }),
      execute: async ({ query, ...options }) => {
        try {
          return await client.searchQNA(query, options)
        } catch (error) {
          return String(error)
        }
      },
    }),
    extract: tool({
      description: 'Extract content and optionally images from a list of URLs',
      parameters: z.object({
        urls: z
          .array(z.string().url())
          .max(20)
          .describe('List of URLs to extract content from (maximum 20 URLs)'),
      }),
      execute: async ({ urls }) => {
        try {
          const response = await client.extract(urls)
          return {
            results: response.results.map((result) => ({
              url: result.url,
              rawContent: result.rawContent,
            })),
          } as TavilyExtractResponse
        } catch (error) {
          return {
            results: [],
            error: String(error),
          } as TavilyExtractResponse
        }
      },
    }),
  }

  for (const toolName in tools) {
    if (config?.excludeTools?.includes(toolName as TavilyTools)) {
      delete tools[toolName as TavilyTools]
    }
  }

  return tools
}
