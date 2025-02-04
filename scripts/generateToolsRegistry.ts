import fs from 'node:fs'
import path from 'node:path'

type AvailableTools = Record<
  string,
  {
    author: string
    name: string
    type: 'registry:lib'
    description: string
    dependencies: string[]
    devDependencies?: string[]
    files: {
      path: string
      type: 'registry:lib'
      content: string
      target: ''
    }[]
    ui: {
      usage: string
      title: 'Platforms' | 'Search' | 'Utils'
    }
  }
>

const availableTools: AvailableTools = {
  discord: {
    author: 'https://nicolasmontone.com',
    name: 'discord',
    type: 'registry:lib',
    description:
      'Discord integration tools for sending messages, managing channels, and handling message history. Includes features for sending messages, retrieving channel history, managing channels, and message operations with full Discord markdown support.',
    dependencies: ['zod', 'ai'],
    files: [
      {
        path: 'lib/tools/discord.ts',
        type: 'registry:lib',
        content: fs.readFileSync(
          path.join(__dirname, '..', 'tools', 'discord.ts'),
          'utf-8'
        ),
        target: '',
      },
    ],
    ui: {
      usage: fs.readFileSync(
        path.join(__dirname, '..', 'usage', 'discord.txt'),
        'utf-8'
      ),
      title: 'Platforms',
    },
  },
  giphy: {
    author: 'https://nicolasmontone.com',
    name: 'giphy',
    type: 'registry:lib',
    description:
      'Giphy API integration for searching and retrieving GIFs. Supports content rating filters, pagination, and sorting options for finding the perfect animated GIFs.',
    dependencies: ['zod', 'ai', '@giphy/js-fetch-api'],
    files: [
      {
        path: 'lib/tools/giphy.ts',
        type: 'registry:lib',
        content: fs.readFileSync(
          path.join(__dirname, '..', 'tools', 'giphy.ts'),
          'utf-8'
        ),
        target: '',
      },
    ],
    ui: {
      usage: fs.readFileSync(
        path.join(__dirname, '..', 'usage', 'giphy.txt'),
        'utf-8'
      ),
      title: 'Search',
    },
  },
  github: {
    author: 'https://nicolasmontone.com',
    name: 'github',
    type: 'registry:lib',
    description:
      'Comprehensive GitHub API tools for repository management, issue tracking, and pull request handling. Features include repository operations, issue management, PR reviews, and detailed repository analytics.',
    dependencies: ['zod', 'ai', '@octokit/rest'],
    files: [
      {
        path: 'lib/tools/github.ts',
        type: 'registry:lib',
        content: fs.readFileSync(
          path.join(__dirname, '..', 'tools', 'github.ts'),
          'utf-8'
        ),
        target: '',
      },
    ],
    ui: {
      usage: fs.readFileSync(
        path.join(__dirname, '..', 'usage', 'github.txt'),
        'utf-8'
      ),
      title: 'Platforms',
    },
  },
  math: {
    author: 'https://nicolasmontone.com',
    name: 'math',
    type: 'registry:lib',
    description:
      'Mathematical calculation tools providing essential mathematical operations including trigonometric functions, logarithms, exponentials, and basic arithmetic calculations.',
    dependencies: ['zod', 'ai'],
    files: [
      {
        path: 'lib/tools/math.ts',
        type: 'registry:lib',
        content: fs.readFileSync(
          path.join(__dirname, '..', 'tools', 'math.ts'),
          'utf-8'
        ),
        target: '',
      },
    ],
    ui: {
      usage: fs.readFileSync(
        path.join(__dirname, '..', 'usage', 'math.txt'),
        'utf-8'
      ),
      title: 'Utils',
    },
  },
  perplexity: {
    author: 'https://nicolasmontone.com',
    name: 'perplexity',
    type: 'registry:lib',
    description:
      'Perplexity AI integration for advanced web search and information retrieval. Features customizable model parameters, system prompts, and returns both content and citations for comprehensive results.',
    dependencies: ['zod', 'ai'],
    files: [
      {
        path: 'lib/tools/perplexity.ts',
        type: 'registry:lib',
        content: fs.readFileSync(
          path.join(__dirname, '..', 'tools', 'perplexity.ts'),
          'utf-8'
        ),
        target: '',
      },
    ],
    ui: {
      usage: fs.readFileSync(
        path.join(__dirname, '..', 'usage', 'perplexity.txt'),
        'utf-8'
      ),
      title: 'Search',
    },
  },
  postgres: {
    author: 'https://nicolasmontone.com',
    name: 'postgres',
    type: 'registry:lib',
    description:
      'PostgreSQL database integration tools for database operations and management. Includes functionality for querying, data manipulation, and database administration tasks.',
    dependencies: ['zod', 'ai', 'pg'],
    devDependencies: ['@types/pg'],
    files: [
      {
        path: 'lib/tools/postgres.ts',
        type: 'registry:lib',
        content: fs.readFileSync(
          path.join(__dirname, '..', 'tools', 'postgres.ts'),
          'utf-8'
        ),
        target: '',
      },
    ],
    ui: {
      usage: fs.readFileSync(
        path.join(__dirname, '..', 'usage', 'postgres.txt'),
        'utf-8'
      ),
      title: 'Utils',
    },
  },
  slack: {
    author: 'https://nicolasmontone.com',
    name: 'slack',
    type: 'registry:lib',
    description:
      'Slack workspace integration tools for messaging and channel management. Features include sending messages, managing threads, channel operations, and workspace administration with full Slack markdown support.',
    dependencies: ['zod', 'ai', '@slack/web-api'],
    files: [
      {
        path: 'lib/tools/slack.ts',
        type: 'registry:lib',
        content: fs.readFileSync(
          path.join(__dirname, '..', 'tools', 'slack.ts'),
          'utf-8'
        ),
        target: '',
      },
    ],
    ui: {
      usage: fs.readFileSync(
        path.join(__dirname, '..', 'usage', 'slack.txt'),
        'utf-8'
      ),
      title: 'Platforms',
    },
  },
  tavily: {
    author: 'https://nicolasmontone.com',
    name: 'tavily',
    type: 'registry:lib',
    description:
      'Tavily search API integration offering advanced web search capabilities. Includes comprehensive search, context-aware search, Q&A functionality, and content extraction from URLs with customizable search parameters.',
    dependencies: ['zod', 'ai', '@tavily/core'],
    files: [
      {
        path: 'lib/tools/tavily.ts',
        type: 'registry:lib',
        content: fs.readFileSync(
          path.join(__dirname, '..', 'tools', 'tavily.ts'),
          'utf-8'
        ),
        target: '',
      },
    ],
    ui: {
      usage: fs.readFileSync(
        path.join(__dirname, '..', 'usage', 'tavily.txt'),
        'utf-8'
      ),
      title: 'Search',
    },
  },
  vercel: {
    author: 'https://nicolasmontone.com',
    name: 'vercel',
    type: 'registry:lib',
    description:
      'Vercel platform integration tools for deployment and project management. Enables interaction with Vercel services for managing deployments, domains, and project configurations.',
    dependencies: ['zod', 'ai', '@vercel/sdk'],
    files: [
      {
        path: 'lib/tools/vercel.ts',
        type: 'registry:lib',
        content: fs.readFileSync(
          path.join(__dirname, '..', 'tools', 'vercel.ts'),
          'utf-8'
        ),
        target: '',
      },
    ],
    ui: {
      usage: fs.readFileSync(
        path.join(__dirname, '..', 'usage', 'vercel.txt'),
        'utf-8'
      ),
      title: 'Platforms',
    },
  },
} as const

// first we write a file data.ts with an object with all the data of the tools
fs.writeFileSync(
  path.join(__dirname, '..', 'app/data.ts'),
  `export const tools = ${JSON.stringify(availableTools, null, 2)}`
)

// then we write in public folder each component as json to make it public for chad/cn cli
for (const tool in availableTools) {
  delete availableTools[tool].ui
  fs.writeFileSync(
    path.join(__dirname, '..', 'public', `r/${tool}.json`),
    JSON.stringify(availableTools[tool], null, 2)
  )
}
