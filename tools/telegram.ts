import { type Tool, tool } from 'ai'
import { z } from 'zod'

export type TelegramTools = 'sendMessage'

export const telegramTools = (
  { botToken, chatId }: { botToken: string; chatId: string },
  config?: { excludeTools?: TelegramTools[] }
): Partial<Record<TelegramTools, Tool>> => {
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

  const tools: Partial<Record<TelegramTools, Tool>> = {
    sendMessage: tool({
      description: 'Send a message to a telegram chat',
      parameters: z.object({
        message: z.string().describe('The message to send'),
      }),
      execute: async ({ message }) => {
        const response = await sendMessage(telegramUrl, chatId, message)

        return response
      },
    }),
  }

  if (config?.excludeTools) {
    for (const toolName in tools) {
      if (config.excludeTools.includes(toolName as TelegramTools)) {
        delete tools[toolName as TelegramTools]
      }
    }
  }

  return tools
}

async function sendMessage(
  telegramUrl: string,
  chatId: string,
  message: string
) {
  try {
    const response = await fetch(telegramUrl, {
      method: 'POST',
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    })

    if (!response.ok) {
      return {
        error: 'Failed to send message',
      }
    }

    if (response.status === 200) {
      return {
        success: 'Message sent successfully',
      }
    }
  } catch {
    return {
      error: 'Failed to send message',
    }
  }
}
