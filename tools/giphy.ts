import { tool, type Tool } from 'ai'
import { z } from 'zod'
import { GiphyFetch } from '@giphy/js-fetch-api'

type GiphyTools = 'search'

type Rating = 'pg' | 'g' | 'y' | 'pg-13' | 'r'
/**
 * Sorting options
 */
type SortTypes = 'relevant' | 'recent'

/**
 * Make a request to Giphy API using the official SDK
 */

async function makeRequest(
  client: GiphyFetch,
  params: {
    q: string
    limit?: number
    offset?: number
    rating?: Rating
    sort?: SortTypes
  }
) {
  try {
    const result = await client.search(params.q, params)
    return { data: result.data }
  } catch (error) {
    return { error: String(error) }
  }
}

// Individual tool functions
async function searchGifs(
  client: GiphyFetch,
  query: string,
  limit = 10,
  offset = 0,
  rating?: Rating,
  sort?: SortTypes
) {
  return makeRequest(client, {
    q: query,
    limit,
    offset,
    rating,
    sort,
  })
}

export const giphyTools = (
  { apiKey }: { apiKey: string },
  config?: {
    excludeTools?: GiphyTools[]
  }
): Partial<Record<GiphyTools, Tool>> => {
  if (!apiKey) {
    throw new Error('Giphy API key is required')
  }

  const client = new GiphyFetch(apiKey)
  const tools: Partial<Record<GiphyTools, Tool>> = {
    search: tool({
      description: 'Search for GIFs using keywords',
      parameters: z.object({
        query: z.string().describe('The search query to find GIFs'),
        limit: z
          .number()
          .optional()
          .describe('Maximum number of GIFs to return (default: 10)'),
        offset: z
          .number()
          .optional()
          .describe('Starting position of results (default: 0)'),
        rating: z
          .enum(['g', 'pg', 'pg-13', 'r'])
          .optional()
          .describe('Content rating filter'),
        sort: z
          .enum(['relevant', 'recent'])
          .optional()
          .describe('Sorting option'),
      }),
      execute: async ({ query, limit, offset, rating, sort }) => {
        const result = await searchGifs(
          client,
          query,
          limit,
          offset,
          rating,
          sort
        )
        if (result.error) {
          return `Error searching GIFs: ${result.error}`
        }
        return JSON.stringify(result.data, null, 2)
      },
    }),
  }

  // Remove excluded tools
  for (const toolName in tools) {
    if (config?.excludeTools?.includes(toolName as GiphyTools)) {
      delete tools[toolName as GiphyTools]
    }
  }

  return tools
}
