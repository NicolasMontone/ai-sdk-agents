import { tool, type Tool } from 'ai'
import { z } from 'zod'

type DiscordTools =
  | 'sendMessage'
  | 'getChannelInfo'
  | 'listChannels'
  | 'getChannelMessages'
  | 'deleteMessage'

interface DiscordResponse {
  data?: unknown
  error?: string
}

/**
 * Make a request to Discord API.
 * @param url The full URL to make the request to
 * @param options Request options including method, headers, and body
 * @returns A promise that resolves to a DiscordResponse
 */
async function makeRequest(
  url: string,
  options: RequestInit
): Promise<DiscordResponse> {
  try {
    const response = await fetch(url, options)

    // Handle non-OK responses
    if (!response.ok) {
      let errorMessage: string
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || response.statusText
      } catch {
        errorMessage = response.statusText
      }
      console.error(`Discord API Error: ${response.status} - ${errorMessage}`)
      return {
        error: `Discord API Error: ${response.status} - ${errorMessage}`,
      }
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return { data: {} }
    }

    // Parse JSON response
    try {
      const data = await response.json()
      return { data }
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError)
      return { error: 'Error parsing API response' }
    }
  } catch (error) {
    console.error('Network or request error:', error)
    return { error: String(error) }
  }
}

// Individual tool functions
async function sendMessage(
  baseUrl: string,
  headers: HeadersInit,
  channelId: string,
  content: string
): Promise<DiscordResponse> {
  const data = { content }
  return makeRequest(`${baseUrl}/channels/${channelId}/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })
}

async function getChannelInfo(
  baseUrl: string,
  headers: HeadersInit,
  channelId: string
): Promise<DiscordResponse> {
  return makeRequest(`${baseUrl}/channels/${channelId}`, {
    method: 'GET',
    headers,
  })
}

async function listChannels(
  baseUrl: string,
  headers: HeadersInit,
  guildId: string
): Promise<DiscordResponse> {
  return makeRequest(`${baseUrl}/guilds/${guildId}/channels`, {
    method: 'GET',
    headers,
  })
}

async function getChannelMessages(
  baseUrl: string,
  headers: HeadersInit,
  channelId: string,
  limit = 100
): Promise<DiscordResponse> {
  return makeRequest(
    `${baseUrl}/channels/${channelId}/messages?limit=${limit}`,
    {
      method: 'GET',
      headers,
    }
  )
}

async function deleteMessage(
  baseUrl: string,
  headers: HeadersInit,
  channelId: string,
  messageId: string
): Promise<DiscordResponse> {
  return makeRequest(`${baseUrl}/channels/${channelId}/messages/${messageId}`, {
    method: 'DELETE',
    headers,
  })
}

// Main Discord tools factory function
export const discordTools = (
  { token }: { token: string },
  config?: {
    excludeTools?: DiscordTools[]
  }
): Partial<Record<DiscordTools, Tool>> => {
  const baseUrl = 'https://discord.com/api/v10'
  const headers = {
    Authorization: `Bot ${token}`,
    'Content-Type': 'application/json',
  }

  const tools: Partial<Record<DiscordTools, Tool>> = {
    sendMessage: tool({
      description: 'Send a message to a Discord channel',
      parameters: z.object({
        channelId: z
          .string()
          .describe('The ID of the channel to send the message to'),
        content: z
          .string()
          .describe('The message content to send, supports Discord markdown'),
      }),
      execute: async ({ channelId, content }) => {
        const result = await sendMessage(baseUrl, headers, channelId, content)
        if (result.error) {
          return `Error sending message: ${result.error}`
        }
        return `Message sent successfully to channel ${channelId}`
      },
    }),

    getChannelMessages: tool({
      description: 'Get message history from a Discord channel',
      parameters: z.object({
        channelId: z
          .string()
          .describe('The ID of the channel to fetch messages from'),
        limit: z
          .number()
          .optional()
          .describe('Maximum number of messages to retrieve (default: 100)'),
      }),
      execute: async ({ channelId, limit }) => {
        const result = await getChannelMessages(
          baseUrl,
          headers,
          channelId,
          limit
        )
        if (result.error) {
          return `Error getting messages: ${result.error}`
        }
        return JSON.stringify(result.data, null, 2)
      },
    }),

    getChannelInfo: tool({
      description: 'Get information about a Discord channel',
      parameters: z.object({
        channelId: z
          .string()
          .describe('The ID of the channel to get information about'),
      }),
      execute: async ({ channelId }) => {
        const result = await getChannelInfo(baseUrl, headers, channelId)
        if (result.error) {
          return `Error getting channel info: ${result.error}`
        }
        return JSON.stringify(result.data, null, 2)
      },
    }),

    listChannels: tool({
      description: 'List all channels in a Discord server (guild)',
      parameters: z.object({
        guildId: z
          .string()
          .describe('The ID of the server (guild) to list channels from'),
      }),
      execute: async ({ guildId }) => {
        const result = await listChannels(baseUrl, headers, guildId)
        if (result.error) {
          return `Error listing channels: ${result.error}`
        }
        return JSON.stringify(result.data, null, 2)
      },
    }),

    deleteMessage: tool({
      description: 'Delete a message from a Discord channel',
      parameters: z.object({
        channelId: z
          .string()
          .describe('The ID of the channel containing the message'),
        messageId: z.string().describe('The ID of the message to delete'),
      }),
      execute: async ({ channelId, messageId }) => {
        const result = await deleteMessage(
          baseUrl,
          headers,
          channelId,
          messageId
        )
        if (result.error) {
          return `Error deleting message: ${result.error}`
        }
        return `Message ${messageId} deleted successfully from channel ${channelId}`
      },
    }),
  }

  for (const toolName in tools) {
    if (config?.excludeTools?.includes(toolName as DiscordTools)) {
      delete tools[toolName as DiscordTools]
    }
  }

  return tools
}
