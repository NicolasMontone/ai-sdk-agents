import { tool, type Tool } from 'ai'
import { z } from 'zod'
import { WebClient } from '@slack/web-api'

type SlackTools =
  | 'sendMessage'
  | 'sendThreadReply'
  | 'getChannelHistory'
  | 'getThreadReplies'
  | 'listChannels'
  | 'createChannel'
  | 'inviteToChannel'
  | 'setChannelTopic'

interface SlackMessage {
  ts: string
  text: string
  user: string
  thread_ts?: string
  reply_count?: number
}

interface SlackChannel {
  id: string
  name: string
  topic?: { value: string }
  purpose?: { value: string }
  is_private: boolean
  num_members: number
}

export const slackTools = (
  { token }: { token: string },
  config?: {
    excludeTools?: SlackTools[]
  }
): Partial<Record<SlackTools, Tool>> => {
  const client = new WebClient(token)

  const tools: Partial<Record<SlackTools, Tool>> = {
    sendMessage: tool({
      description: 'Send a message to a Slack channel or user',
      parameters: z.object({
        channel: z
          .string()
          .describe('Channel ID or name to send the message to'),
        text: z
          .string()
          .describe(
            'The message text to send, supports Slack markdown formatting'
          ),
        thread_ts: z
          .string()
          .optional()
          .describe('Timestamp of the parent message to reply in a thread'),
      }),
      execute: async ({ channel, text, thread_ts }) => {
        return sendMessage(client, { channel, text, thread_ts })
      },
    }),

    sendThreadReply: tool({
      description: 'Send a reply message in a specific thread',
      parameters: z.object({
        channel: z.string().describe('Channel ID where the thread is located'),
        thread_ts: z
          .string()
          .describe('Timestamp of the parent message to reply to'),
        text: z
          .string()
          .describe(
            'The reply text to send, supports Slack markdown formatting'
          ),
      }),
      execute: async ({ channel, thread_ts, text }) => {
        return sendMessage(client, { channel, text, thread_ts })
      },
    }),

    getChannelHistory: tool({
      description: 'Get message history from a Slack channel',
      parameters: z.object({
        channel: z.string().describe('Channel ID to fetch history from'),
        limit: z
          .number()
          .optional()
          .describe('Number of messages to return (default: 100, max: 1000)'),
        oldest: z
          .string()
          .optional()
          .describe('Start of time range (timestamp) to include messages from'),
        latest: z
          .string()
          .optional()
          .describe('End of time range (timestamp) to include messages from'),
      }),
      execute: async ({ channel, limit, oldest, latest }) => {
        return getChannelHistory(client, { channel, limit, oldest, latest })
      },
    }),

    getThreadReplies: tool({
      description: 'Get all replies in a specific thread',
      parameters: z.object({
        channel: z.string().describe('Channel ID where the thread is located'),
        thread_ts: z
          .string()
          .describe('Timestamp of the parent message to get replies for'),
        limit: z
          .number()
          .optional()
          .describe('Number of replies to return (default: 100, max: 1000)'),
      }),
      execute: async ({ channel, thread_ts, limit }) => {
        return getThreadReplies(client, { channel, thread_ts, limit })
      },
    }),

    listChannels: tool({
      description: 'List all channels in the workspace',
      parameters: z.object({
        exclude_archived: z
          .boolean()
          .optional()
          .describe('Exclude archived channels from the list'),
        types: z
          .array(z.enum(['public_channel', 'private_channel']))
          .optional()
          .describe('Types of channels to include'),
      }),
      execute: async ({ exclude_archived, types }) => {
        return listChannels(client, { exclude_archived, types })
      },
    }),

    createChannel: tool({
      description: 'Create a new Slack channel',
      parameters: z.object({
        name: z
          .string()
          .describe(
            'Name of the channel (lowercase letters, numbers, hyphens only)'
          ),
        is_private: z
          .boolean()
          .optional()
          .describe('Create a private channel instead of a public one'),
        topic: z.string().optional().describe('Set the channel topic'),
      }),
      execute: async ({ name, is_private, topic }) => {
        return createChannel(client, { name, is_private, topic })
      },
    }),

    inviteToChannel: tool({
      description: 'Invite users to a channel',
      parameters: z.object({
        channel: z.string().describe('Channel ID to invite users to'),
        users: z
          .array(z.string())
          .describe('List of user IDs to invite to the channel'),
      }),
      execute: async ({ channel, users }) => {
        return inviteToChannel(client, { channel, users })
      },
    }),

    setChannelTopic: tool({
      description: 'Set or update a channel topic',
      parameters: z.object({
        channel: z.string().describe('Channel ID to set the topic for'),
        topic: z.string().describe('New topic text for the channel'),
      }),
      execute: async ({ channel, topic }) => {
        return setChannelTopic(client, { channel, topic })
      },
    }),
  }

  for (const toolName in tools) {
    if (config?.excludeTools?.includes(toolName as SlackTools)) {
      delete tools[toolName as SlackTools]
    }
  }

  return tools
}

async function sendMessage(
  client: WebClient,
  {
    channel,
    text,
    thread_ts,
  }: { channel: string; text: string; thread_ts?: string }
) {
  try {
    const result = await client.chat.postMessage({
      channel,
      text,
      thread_ts,
    })
    return { ok: result.ok, ts: result.ts, channel: result.channel }
  } catch (error) {
    return { error: String(error) }
  }
}

async function getChannelHistory(
  client: WebClient,
  {
    channel,
    limit = 100,
    oldest,
    latest,
  }: {
    channel: string
    limit?: number
    oldest?: string
    latest?: string
  }
) {
  try {
    const result = await client.conversations.history({
      channel,
      limit,
      oldest,
      latest,
    })
    return {
      ok: result.ok,
      messages: result.messages as SlackMessage[],
    }
  } catch (error) {
    return { error: String(error) }
  }
}

async function getThreadReplies(
  client: WebClient,
  {
    channel,
    thread_ts,
    limit = 100,
  }: {
    channel: string
    thread_ts: string
    limit?: number
  }
) {
  try {
    const result = await client.conversations.replies({
      channel,
      ts: thread_ts,
      limit,
    })
    return {
      ok: result.ok,
      messages: result.messages as SlackMessage[],
    }
  } catch (error) {
    return { error: String(error) }
  }
}

async function listChannels(
  client: WebClient,
  {
    exclude_archived = true,
    types = ['public_channel'],
  }: {
    exclude_archived?: boolean
    types?: ('public_channel' | 'private_channel')[]
  }
) {
  try {
    const result = await client.conversations.list({
      exclude_archived,
      types: types.join(','),
    })
    return {
      ok: result.ok,
      channels: result.channels as SlackChannel[],
    }
  } catch (error) {
    return { error: String(error) }
  }
}

async function createChannel(
  client: WebClient,
  {
    name,
    is_private = false,
    topic,
  }: {
    name: string
    is_private?: boolean
    topic?: string
  }
) {
  try {
    const result = await client.conversations.create({
      name,
      is_private,
    })

    if (topic && result.ok && result.channel?.id) {
      await client.conversations.setTopic({
        channel: result.channel.id,
        topic,
      })
    }

    return { ok: result.ok, channel: result.channel as SlackChannel }
  } catch (error) {
    return { error: String(error) }
  }
}

async function inviteToChannel(
  client: WebClient,
  { channel, users }: { channel: string; users: string[] }
) {
  try {
    const result = await client.conversations.invite({
      channel,
      users: users.join(','),
    })
    return { ok: result.ok, channel: result.channel }
  } catch (error) {
    return { error: String(error) }
  }
}

async function setChannelTopic(
  client: WebClient,
  { channel, topic }: { channel: string; topic: string }
) {
  try {
    const result = await client.conversations.setTopic({
      channel,
      topic,
    })
    return { ok: result.ok, topic }
  } catch (error) {
    return { error: String(error) }
  }
}
