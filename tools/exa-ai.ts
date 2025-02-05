import { type Tool, tool } from 'ai'
import { z } from 'zod'
import Exa from 'exa-js'

export type ExaTools =
  | 'searchUrls'
  | 'searchForUrlsContent'
  | 'searchWikipedia'
  | 'searchReddit'
  | 'searchNews'

export const exaTools = (
  {
    apiKey,
    numResults,
    includeDomains,
    excludeDomains,
    maxCharacters,
  }: {
    apiKey: string
    numResults?: number
    includeDomains?: string[]
    excludeDomains?: string[]
    // used for searchForUrlsContent
    maxCharacters?: number
  },
  {
    excludeTools,
  }: {
    excludeTools?: ExaTools[]
  }
): Partial<Record<ExaTools, Tool>> => {
  const exa = new Exa(apiKey)

  const tools: Partial<Record<ExaTools, Tool>> = {
    searchUrls: tool({
      description:
        'Based on a query returns a list of URLs that are relevant to the query.',
      parameters: z.object({
        query: z.string().describe('The query to search for'),
      }),
      execute: async ({ query }) => {
        const results = await performExaSearch(exa, {
          query,
          numResults: numResults ?? 5,
          includeDomains,
          excludeDomains,
        })
        return results
      },
    }),
    searchForUrlsContent: tool({
      description:
        'Retrieve the contents of a list of pages given a list of URLs.',
      parameters: z.object({
        urls: z
          .array(z.string().url())
          .describe('The URLs to retrieve contents for'),
      }),
      execute: async ({ urls }) => {
        const results = await exaGetContents(exa, {
          urls,
          maxCharacters: maxCharacters,
        })
        return results
      },
    }),
    searchWikipedia: tool({
      description: 'Fetch the wikipedia page for a given website URL.',
      parameters: z.object({
        query: z
          .string()
          .describe('The search term or URL to find Wikipedia information for'),
      }),
      execute: async ({ query }) => {
        const result = await exaSearchWikipedia(exa, { query })
        return result
      },
    }),
    searchReddit: tool({
      description: 'Fetch the reddit page for a given website URL.',
      parameters: z.object({
        query: z
          .string()
          .describe('The search term or URL to find Reddit information for'),
      }),
      execute: async ({ query }) => {
        const result = await exaSearchReddit(exa, { query })
        return result
      },
    }),
    searchNews: tool({
      description: 'Fetch the latest news for a given query.',
      parameters: z.object({
        query: z.string().describe('The query to search for'),
      }),
      execute: async ({ query }) => {
        const result = await exaSearchNews(exa, { query })
        return result
      },
    }),
  }

  if (excludeTools) {
    for (const toolName in tools) {
      if (excludeTools.includes(toolName as ExaTools)) {
        delete tools[toolName as ExaTools]
      }
    }
  }

  return tools
}

async function performExaSearch(
  exa: Exa,
  config: {
    query: string
    numResults?: number
    includeDomains?: string[]
    excludeDomains?: string[]
  }
) {
  const { results } = await exa.search(config.query, {
    numResults: config.numResults,
    useAutoprompt: true,
    includeDomains: config.includeDomains,
    excludeDomains: config.excludeDomains,
  })
  return results
}

async function exaGetContents(
  exa: Exa,
  config: {
    urls: string[]
    numResults?: number
    includeDomains?: string[]
    excludeDomains?: string[]
    maxCharacters?: number
  }
) {
  const { results } = await exa.getContents(config.urls, {
    useAutoprompt: true,
    includeDomains: config.includeDomains,
    excludeDomains: config.excludeDomains,
    maxCharacters: config.maxCharacters,
    text: true,
  })
  return results
}

async function exaSearchWikipedia(exa: Exa, { query }: { query: string }) {
  const { results } = await exa.searchAndContents(`${query} wikipedia page:`, {
    type: 'keyword',
    livecrawl: 'always',
    includeDomains: ['wikipedia.org'],
    numResults: 1,
    text: true,
    includeText: [query],
  })
  return results
}

async function exaSearchReddit(exa: Exa, { query }: { query: string }) {
  const result = await exa.search(query, {
    type: 'keyword',
    includeDomains: ['reddit.com'],
    includeText: [query],
  })
  return result.results
}

async function exaSearchNews(exa: Exa, { query }: { query: string }) {
  const result = await exa.searchAndContents(`[${query}] latest news:`, {
    category: 'news',
    type: 'keyword',
    text: true,
    livecrawl: 'always',
    includeText: [query],
    numResults: 10,
  })

  return result.results
}
