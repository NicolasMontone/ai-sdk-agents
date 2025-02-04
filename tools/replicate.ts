import { createReplicate } from '@ai-sdk/replicate'

import {
  experimental_generateImage as generateImage,
  tool,
  type Tool,
} from 'ai'
import { z } from 'zod'

export type ReplicateTools = 'createImage'

const replicateModels = [
  'black-forest-labs/flux-1.1-pro',
  'black-forest-labs/flux-1.1-pro-ultra',
  'black-forest-labs/flux-dev',
  'black-forest-labs/flux-pro',
  'black-forest-labs/flux-schnell',
  'bytedance/sdxl-lightning-4step',
  'fofr/aura-flow',
  'fofr/latent-consistency-model',
  'fofr/realvisxl-v3-multi-controlnet-lora',
  'fofr/sdxl-emoji',
  'fofr/sdxl-multi-controlnet-lora',
  'ideogram-ai/ideogram-v2',
  'ideogram-ai/ideogram-v2-turbo',
  'lucataco/dreamshaper-xl-turbo',
  'lucataco/open-dalle-v1.1',
  'lucataco/realvisxl-v2.0',
  'lucataco/realvisxl2-lcm',
  'luma/photon',
  'luma/photon-flash',
  'nvidia/sana',
  'playgroundai/playground-v2.5-1024px-aesthetic',
  'recraft-ai/recraft-v3',
  'recraft-ai/recraft-v3-svg',
  'stability-ai/stable-diffusion-3.5-large',
  'stability-ai/stable-diffusion-3.5-large-turbo',
  'stability-ai/stable-diffusion-3.5-medium',
  'tstramer/material-diffusion',
] as const

type ReplicateModel = (typeof replicateModels)[number] | (string & {})

export const replicateTools = (
  { apiKey, model }: { apiKey: string; model?: ReplicateModel },
  config?: {
    excludeTools?: ReplicateTools[]
  }
): Partial<Record<ReplicateTools, Tool>> => {
  if (
    !replicateModels.includes(
      (model ||
        'black-forest-labs/flux-1.1-pro') as (typeof replicateModels)[number]
    )
  ) {
    throw new Error('Invalid model')
  }
  const tools: Partial<Record<ReplicateTools, Tool>> = {
    createImage: tool({
      description: 'Create an image based on the prompt',
      parameters: z.object({
        prompt: z.string().describe('The prompt to create an image based on'),
      }),
      execute: async ({ prompt }) => {
        return await createImage(
          prompt,
          model ?? 'black-forest-labs/flux-1.1-pro',
          apiKey
        )
      },
    }),
  }

  for (const toolName in tools) {
    if (config?.excludeTools?.includes(toolName as ReplicateTools)) {
      delete tools[toolName as ReplicateTools]
    }
  }

  return tools
}

async function createImage(
  prompt: string,
  model: ReplicateModel,
  apiToken: string
) {
  const replicate = createReplicate({
    apiToken,
  })

  return await generateImage({
    model: replicate.image(model),
    prompt,
  })
}
