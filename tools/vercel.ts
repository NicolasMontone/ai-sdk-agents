import { tool, type Tool } from 'ai'
import { z } from 'zod'
import { Vercel } from '@vercel/sdk'

type VercelTools = 'searchProjects' | 'searchDeployments' | 'searchDomains'

const tokenSchema = z.string().describe('The Vercel API token').min(24)

export const vercelTools = (
  { token }: { token: string },
  config?: { excludeTools?: VercelTools[] }
): Partial<Record<VercelTools, Tool>> => {
  const tokenParsed = tokenSchema.safeParse(token)
  if (!tokenParsed.success) {
    throw new Error('Invalid Vercel API token')
  }
  const client = new Vercel({ bearerToken: token })
  const tools: Partial<Record<VercelTools, Tool>> = {
    searchProjects: tool({
      description: 'Search for projects in Vercel',
      parameters: z.object({}),
      execute: async () => {
        const response = await searchProjects(client)
        return response
      },
    }),
    searchDeployments: tool({
      description: 'Search for deployments in Vercel',
      parameters: z.object({
        query: z.string().describe('The search query to find deployments'),
      }),
      execute: async ({ query }) => {
        const response = await searchDeployments(client, query)
        return response
      },
    }),
    searchDomains: tool({
      description: 'Search for domains in Vercel',
      parameters: z.object({}),
      execute: async () => {
        const response = await searchDomains(client)
        return response
      },
    }),
  }

  for (const toolName in tools) {
    if (config?.excludeTools?.includes(toolName as VercelTools)) {
      delete tools[toolName as VercelTools]
    }
  }

  return tools
}

function searchProjects(client: Vercel) {
  return client.projects.getProjects({
    limit: '20',
  })
}

function searchDeployments(client: Vercel, query: string) {
  return client.deployments.getDeployments({
    limit: 20,
    projectId: query,
  })
}

function searchDomains(client: Vercel) {
  return client.domains.getDomains({
    limit: 20,
  })
}
