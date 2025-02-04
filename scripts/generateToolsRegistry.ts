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
      title: 'Platforms' | 'Search' | 'Utils' | 'Image Generation'
      tools: {
        title: string
        description: string
      }[]
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
      tools: [
        {
          title: 'sendMessage',
          description: 'Send a message to a Discord channel',
        },
        {
          title: 'getChannelInfo',
          description: 'Get information about a Discord channel',
        },
        {
          title: 'listChannels',
          description: 'List all channels in a Discord server',
        },
        {
          title: 'getChannelMessages',
          description: 'Get messages from a Discord channel',
        },
        {
          title: 'deleteMessage',
          description: 'Delete a message from a Discord channel',
        },
      ],
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
      tools: [
        {
          title: 'search',
          description: 'Search for GIFs on Giphy',
        },
      ],
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
      tools: [
        {
          title: 'searchRepositories',
          description: 'Search for repositories on GitHub',
        },
        {
          title: 'listRepositories',
          description: 'List all repositories on GitHub',
        },
        {
          title: 'getRepository',
          description: 'Get information about a GitHub repository',
        },
        {
          title: 'listPullRequests',
          description: 'List all pull requests on a GitHub repository',
        },
        {
          title: 'getPullRequest',
          description: 'Get information about a GitHub pull request',
        },
        {
          title: 'getPullRequestChanges',
          description: 'Get changes from a GitHub pull request',
        },
        {
          title: 'createIssue',
          description: 'Create an issue on a GitHub repository',
        },
        {
          title: 'reopenIssue',
          description: 'Reopen an issue on a GitHub repository',
        },
        {
          title: 'assignIssue',
          description: 'Assign an issue to a user on a GitHub repository',
        },
        {
          title: 'labelIssue',
          description: 'Label an issue on a GitHub repository',
        },
        {
          title: 'listIssueComments',
          description: 'List all comments on an issue on a GitHub repository',
        },
        {
          title: 'editIssue',
          description: 'Edit an issue on a GitHub repository',
        },
      ],
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
      tools: [
        {
          title: 'add',
          description: 'Add two numbers',
        },
        {
          title: 'subtract',
          description: 'Subtract two numbers',
        },
        {
          title: 'multiply',
          description: 'Multiply two numbers',
        },
        {
          title: 'divide',
          description: 'Divide two numbers',
        },
        {
          title: 'exponentiate',
          description: 'Exponentiate a number',
        },
        {
          title: 'factorial',
          description: 'Calculate the factorial of a number',
        },
        {
          title: 'isPrime',
          description: 'Check if a number is prime',
        },
        {
          title: 'squareRoot',
          description: 'Calculate the square root of a number',
        },
        {
          title: 'sin',
          description: 'Calculate the sine of a number',
        },
        {
          title: 'cos',
          description: 'Calculate the cosine of a number',
        },
        {
          title: 'tan',
          description: 'Calculate the tangent of a number',
        },
        {
          title: 'sqrt',
          description: 'Calculate the square root of a number',
        },
        {
          title: 'log',
          description: 'Calculate the logarithm of a number',
        },
        {
          title: 'exp',
          description: 'Calculate the exponential of a number',
        },
      ],
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
      tools: [
        {
          title: 'search',
          description: 'Search for information on Perplexity',
        },
      ],
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
      tools: [
        {
          title: 'getPublicTablesWithColumns',
          description: 'Get public tables with columns',
        },
        {
          title: 'getExplainForQuery',
          description: 'Get explain for a query',
        },
        {
          title: 'runQuery',
          description: 'Run a query',
        },
      ],
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
      tools: [
        {
          title: 'sendMessage',
          description: 'Send a message to a Slack channel',
        },
        {
          title: 'sendThreadReply',
          description: 'Send a reply to a thread in a Slack channel',
        },
        {
          title: 'getChannelHistory',
          description: 'Get the history of a Slack channel',
        },
        {
          title: 'getThreadReplies',
          description: 'Get the replies to a thread in a Slack channel',
        },
        {
          title: 'listChannels',
          description: 'List all channels in a Slack workspace',
        },
        {
          title: 'createChannel',
          description: 'Create a new channel in a Slack workspace',
        },
        {
          title: 'inviteToChannel',
          description: 'Invite a user to a Slack channel',
        },
        {
          title: 'setChannelTopic',
          description: 'Set the topic of a Slack channel',
        },
      ],
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
      tools: [
        {
          title: 'search',
          description: 'Search for information on Tavily',
        },
        {
          title: 'searchContext',
          description: 'Search for information on Tavily with context',
        },
        {
          title: 'searchQNA',
          description: 'Search for information on Tavily with Q&A',
        },
        {
          title: 'extract',
          description: 'Extract information from a URL',
        },
      ],
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
      tools: [
        {
          title: 'searchProjects',
          description: 'Search for projects in Vercel',
        },
        {
          title: 'searchDeployments',
          description: 'Search for deployments in Vercel',
        },
        {
          title: 'searchDomains',
          description: 'Search for domains in Vercel',
        },
      ],
    },
  },
  fal: {
    author: 'https://nicolasmontone.com',
    name: 'fal',
    type: 'registry:lib',
    description: 'Fal.ai image generation tools',
    dependencies: ['zod', 'ai', '@ai-sdk/fal'],
    files: [
      {
        path: 'lib/tools/fal.ts',
        type: 'registry:lib',
        content: fs.readFileSync(
          path.join(__dirname, '..', 'tools', 'fal.ts'),
          'utf-8'
        ),
        target: '',
      },
    ],
    ui: {
      usage: fs.readFileSync(
        path.join(__dirname, '..', 'usage', 'fal.txt'),
        'utf-8'
      ),
      title: 'Image Generation',
      tools: [
        {
          title: 'createImage',
          description: 'Create an image based on a prompt',
        },
      ],
    },
  },
  replicate: {
    author: 'https://nicolasmontone.com',
    name: 'replicate',
    type: 'registry:lib',
    description: 'Replicate image generation tools',
    dependencies: ['zod', 'ai', '@ai-sdk/replicate'],
    files: [
      {
        path: 'lib/tools/replicate.ts',
        type: 'registry:lib',
        content: fs.readFileSync(
          path.join(__dirname, '..', 'tools', 'replicate.ts'),
          'utf-8'
        ),
        target: '',
      },
    ],
    ui: {
      usage: fs.readFileSync(
        path.join(__dirname, '..', 'usage', 'replicate.txt'),
        'utf-8'
      ),
      title: 'Image Generation',
      tools: [
        {
          title: 'createImage',
          description: 'Create an image based on a prompt',
        },
      ],
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
  const toolData = { ...availableTools[tool], ui: undefined }

  fs.writeFileSync(
    path.join(__dirname, '..', 'public', `r/${tool}.json`),
    JSON.stringify(toolData, null, 2)
  )
}
