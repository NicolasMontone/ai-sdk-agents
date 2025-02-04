import { tool, type Tool } from 'ai'
import { z } from 'zod'
import { Octokit } from '@octokit/rest'

type GithubTools =
  | 'searchRepositories'
  | 'listRepositories'
  | 'getRepository'
  | 'listPullRequests'
  | 'getPullRequest'
  | 'getPullRequestChanges'
  | 'createIssue'
  | 'createRepository'
  | 'getRepositoryLanguages'
  | 'listIssues'
  | 'getIssue'
  | 'commentOnIssue'
  | 'closeIssue'
  | 'reopenIssue'
  | 'assignIssue'
  | 'labelIssue'
  | 'listIssueComments'
  | 'editIssue'

export const githubTools = (
  { token, baseUrl }: { token: string; baseUrl?: string },
  config?: {
    excludeTools?: GithubTools[]
  }
): Partial<Record<GithubTools, Tool>> => {
  const octokit = new Octokit({
    auth: token,
    ...(baseUrl && { baseUrl }),
  })

  const tools: Partial<Record<GithubTools, Tool>> = {
    searchRepositories: tool({
      description: 'Search for GitHub repositories using keywords, with options to sort and filter results',
      parameters: z.object({
        query: z.string().describe('Search keywords to find repositories. Can include qualifiers like language:typescript or stars:>1000'),
        sort: z
          .enum(['stars', 'forks', 'help-wanted-issues', 'updated'])
          .optional()
          .describe('How to sort the results: by number of stars, forks, help-wanted issues, or last updated date'),
        order: z
          .enum(['asc', 'desc'])
          .optional()
          .describe('Sort order: ascending (lowest to highest) or descending (highest to lowest)'),
        perPage: z.number().optional().describe('Number of repositories to return per page (max: 100)'),
      }),
      execute: async ({
        query,
        sort = 'stars',
        order = 'desc',
        perPage = 5,
      }) => {
        return searchRepositories(octokit, { query, sort, order, perPage })
      },
    }),
    listRepositories: tool({
      description: 'List all repositories that the authenticated user has access to, including personal, organization, and private repositories',
      parameters: z.object({}),
      execute: async () => {
        return listRepositories(octokit)
      },
    }),
    createRepository: tool({
      description: 'Create a new GitHub repository in your personal account or in an organization',
      parameters: z.object({
        name: z.string().describe('Repository name - must be unique within your account or the target organization'),
        private: z
          .boolean()
          .optional()
          .describe('Set to true to create a private repository, false for public. Defaults to false'),
        description: z
          .string()
          .optional()
          .describe('A short description of the repository purpose and contents'),
        autoInit: z
          .boolean()
          .optional()
          .describe('Set to true to initialize with a README.md file. Useful for immediate cloning'),
        organization: z
          .string()
          .optional()
          .describe('Organization name where to create the repository. If not provided, creates in personal account'),
      }),
      execute: async ({
        name,
        private: isPrivate,
        description,
        autoInit,
        organization,
      }) => {
        return createRepository(octokit, {
          name,
          private: isPrivate,
          description,
          autoInit,
          organization,
        })
      },
    }),
    getRepository: tool({
      description: 'Get detailed information about a specific GitHub repository, including stats and metadata',
      parameters: z.object({
        repoName: z
          .string()
          .describe('Full repository name in the format "owner/repo" (e.g., "microsoft/typescript")'),
      }),
      execute: async ({ repoName }) => {
        return getRepository(octokit, repoName)
      },
    }),
    getRepositoryLanguages: tool({
      description: 'Get a breakdown of programming languages used in a repository and their relative proportions',
      parameters: z.object({
        repoName: z
          .string()
          .describe('Full repository name in the format "owner/repo" (e.g., "microsoft/typescript")'),
      }),
      execute: async ({ repoName }) => {
        return getRepositoryLanguages(octokit, repoName)
      },
    }),
    listPullRequests: tool({
      description: 'List pull requests in a repository with filtering options for their current state',
      parameters: z.object({
        repoName: z
          .string()
          .describe('Full repository name in the format "owner/repo" (e.g., "microsoft/typescript")'),
        state: z
          .enum(['open', 'closed', 'all'])
          .optional()
          .describe('Filter PRs by state: open (pending), closed (merged/rejected), or all states'),
      }),
      execute: async ({ repoName, state = 'open' }) => {
        return listPullRequests(octokit, repoName, state)
      },
    }),
    getPullRequest: tool({
      description: 'Get detailed information about a specific pull request, including its status, changes, and review state',
      parameters: z.object({
        repoName: z
          .string()
          .describe('Full repository name in the format "owner/repo" (e.g., "microsoft/typescript")'),
        prNumber: z.number().describe('The pull request number (not ID) as shown in the PR URL'),
      }),
      execute: async ({ repoName, prNumber }) => {
        return getPullRequest(octokit, repoName, prNumber)
      },
    }),
    getPullRequestChanges: tool({
      description: 'Get a detailed list of files modified, added, or deleted in a pull request',
      parameters: z.object({
        repoName: z
          .string()
          .describe('Full repository name in the format "owner/repo" (e.g., "microsoft/typescript")'),
        prNumber: z.number().describe('The pull request number (not ID) as shown in the PR URL'),
      }),
      execute: async ({ repoName, prNumber }) => {
        return getPullRequestChanges(octokit, repoName, prNumber)
      },
    }),
    createIssue: tool({
      description: 'Create a new issue in a repository to track bugs, enhancements, or other tasks',
      parameters: z.object({
        repoName: z
          .string()
          .describe('Full repository name in the format "owner/repo" (e.g., "microsoft/typescript")'),
        title: z.string().describe('Concise summary of the issue - appears in issue lists and notifications'),
        body: z.string().optional().describe('Detailed description of the issue in GitHub Markdown format'),
      }),
      execute: async ({ repoName, title, body }) => {
        return createIssue(octokit, repoName, title, body)
      },
    }),
    listIssues: tool({
      description: 'List issues in a repository with filtering options, excluding pull requests',
      parameters: z.object({
        repoName: z
          .string()
          .describe('Full repository name in the format "owner/repo" (e.g., "microsoft/typescript")'),
        state: z
          .enum(['open', 'closed', 'all'])
          .optional()
          .describe('Filter issues by state: open (active), closed (resolved), or all states'),
      }),
      execute: async ({ repoName, state = 'open' }) => {
        return listIssues(octokit, repoName, state)
      },
    }),
    getIssue: tool({
      description: 'Get detailed information about a specific issue, including its status, assignees, and labels',
      parameters: z.object({
        repoName: z
          .string()
          .describe('Full repository name in the format "owner/repo" (e.g., "microsoft/typescript")'),
        issueNumber: z.number().describe('The issue number (not ID) as shown in the issue URL'),
      }),
      execute: async ({ repoName, issueNumber }) => {
        return getIssue(octokit, repoName, issueNumber)
      },
    }),
    commentOnIssue: tool({
      description: 'Add a new comment to an existing issue to provide feedback or updates',
      parameters: z.object({
        repoName: z
          .string()
          .describe('Full repository name in the format "owner/repo" (e.g., "microsoft/typescript")'),
        issueNumber: z.number().describe('The issue number (not ID) as shown in the issue URL'),
        body: z.string().describe('Comment text in GitHub Markdown format - can include formatting, links, and mentions'),
      }),
      execute: async ({ repoName, issueNumber, body }) => {
        return commentOnIssue(octokit, repoName, issueNumber, body)
      },
    }),
    closeIssue: tool({
      description: 'Close an open issue to indicate it has been resolved or is no longer relevant',
      parameters: z.object({
        repoName: z
          .string()
          .describe('Full repository name in the format "owner/repo" (e.g., "microsoft/typescript")'),
        issueNumber: z.number().describe('The issue number (not ID) as shown in the issue URL'),
      }),
      execute: async ({ repoName, issueNumber }) => {
        return closeIssue(octokit, repoName, issueNumber)
      },
    }),
    reopenIssue: tool({
      description: 'Reopen a previously closed issue if the problem reoccurs or needs further discussion',
      parameters: z.object({
        repoName: z
          .string()
          .describe('Full repository name in the format "owner/repo" (e.g., "microsoft/typescript")'),
        issueNumber: z.number().describe('The issue number (not ID) as shown in the issue URL'),
      }),
      execute: async ({ repoName, issueNumber }) => {
        return reopenIssue(octokit, repoName, issueNumber)
      },
    }),
    assignIssue: tool({
      description: 'Assign one or more users to an issue to indicate who is responsible for addressing it',
      parameters: z.object({
        repoName: z
          .string()
          .describe('Full repository name in the format "owner/repo" (e.g., "microsoft/typescript")'),
        issueNumber: z.number().describe('The issue number (not ID) as shown in the issue URL'),
        assignees: z.array(z.string()).describe('GitHub usernames of people to assign to the issue (must have repository access)'),
      }),
      execute: async ({ repoName, issueNumber, assignees }) => {
        return assignIssue(octokit, repoName, issueNumber, assignees)
      },
    }),
    labelIssue: tool({
      description: 'Add classification labels to an issue for better organization and filtering',
      parameters: z.object({
        repoName: z
          .string()
          .describe('Full repository name in the format "owner/repo" (e.g., "microsoft/typescript")'),
        issueNumber: z.number().describe('The issue number (not ID) as shown in the issue URL'),
        labels: z.array(z.string()).describe('Names of labels to apply - must already exist in the repository'),
      }),
      execute: async ({ repoName, issueNumber, labels }) => {
        return labelIssue(octokit, repoName, issueNumber, labels)
      },
    }),
    listIssueComments: tool({
      description: 'Get all comments on an issue in chronological order to view the discussion history',
      parameters: z.object({
        repoName: z
          .string()
          .describe('Full repository name in the format "owner/repo" (e.g., "microsoft/typescript")'),
        issueNumber: z.number().describe('The issue number (not ID) as shown in the issue URL'),
      }),
      execute: async ({ repoName, issueNumber }) => {
        return listIssueComments(octokit, repoName, issueNumber)
      },
    }),
    editIssue: tool({
      description: 'Modify an existing issue to update its title or description content',
      parameters: z.object({
        repoName: z
          .string()
          .describe('Full repository name in the format "owner/repo" (e.g., "microsoft/typescript")'),
        issueNumber: z.number().describe('The issue number (not ID) as shown in the issue URL'),
        title: z.string().optional().describe('New title for the issue - should be clear and concise'),
        body: z
          .string()
          .optional()
          .describe('New description content in GitHub Markdown format - can include formatting, links, and mentions'),
      }),
      execute: async ({ repoName, issueNumber, title, body }) => {
        return editIssue(octokit, repoName, issueNumber, title, body)
      },
    }),
  }

  for (const toolName in tools) {
    if (config?.excludeTools?.includes(toolName as GithubTools)) {
      delete tools[toolName as GithubTools]
    }
  }

  return tools
}

async function searchRepositories(
  octokit: Octokit,
  {
    query,
    sort,
    order,
    perPage,
  }: { query: string; sort: 'stars' | 'forks' | 'help-wanted-issues' | 'updated'; order: 'asc' | 'desc'; perPage: number }
) {
  try {
    const { data } = await octokit.rest.search.repos({
      q: query,
      sort: sort as 'stars' | 'forks' | 'help-wanted-issues' | 'updated' | undefined,
      order: order as 'asc' | 'desc',
      per_page: perPage,
    })

    return data.items.map((repo) => ({
      fullName: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
    }))
  } catch (error) {
    return { error: String(error) }
  }
}

async function listRepositories(octokit: Octokit) {
  try {
    const { data } = await octokit.rest.repos.listForAuthenticatedUser()
    return data.map((repo) => repo.full_name)
  } catch (error) {
    return { error: String(error) }
  }
}

async function createRepository(
  octokit: Octokit,
  {
    name,
    private: isPrivate,
    description,
    autoInit,
    organization,
  }: {
    name: string
    private?: boolean
    description?: string
    autoInit?: boolean
    organization?: string
  }
) {
  try {
    const params = {
      name,
      private: isPrivate,
      description,
      auto_init: autoInit,
    }

    const { data } = organization
      ? await octokit.rest.repos.createInOrg({ ...params, org: organization })
      : await octokit.rest.repos.createForAuthenticatedUser(params)

    return {
      name: data.full_name,
      url: data.html_url,
      private: data.private,
      description: data.description,
    }
  } catch (error) {
    return { error: String(error) }
  }
}

async function getRepository(octokit: Octokit, repoName: string) {
  try {
    const [owner, repo] = repoName.split('/')
    const { data } = await octokit.rest.repos.get({ owner, repo })

    return {
      name: data.full_name,
      description: data.description,
      url: data.html_url,
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssues: data.open_issues_count,
      language: data.language,
      license: data.license?.name,
      defaultBranch: data.default_branch,
    }
  } catch (error) {
    return { error: String(error) }
  }
}

async function getRepositoryLanguages(octokit: Octokit, repoName: string) {
  try {
    const [owner, repo] = repoName.split('/')
    const { data } = await octokit.rest.repos.listLanguages({ owner, repo })
    return data
  } catch (error) {
    return { error: String(error) }
  }
}

async function listPullRequests(
  octokit: Octokit,
  repoName: string,
  state: string
) {
  try {
    const [owner, repo] = repoName.split('/')
    const { data } = await octokit.rest.pulls.list({
      owner,
      repo,
      state: state as 'open' | 'closed' | 'all',
    })

    return data.map((pr) => ({
      number: pr.number,
      title: pr.title,
      user: pr.user?.login,
      createdAt: pr.created_at,
      state: pr.state,
      url: pr.html_url,
    }))
  } catch (error) {
    return { error: String(error) }
  }
}

async function getPullRequest(
  octokit: Octokit,
  repoName: string,
  prNumber: number
) {
  try {
    const [owner, repo] = repoName.split('/')
    const { data } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
    })

    return {
      number: data.number,
      title: data.title,
      user: data.user?.login,
      body: data.body,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      state: data.state,
      merged: data.merged,
      mergeable: data.mergeable,
      url: data.html_url,
    }
  } catch (error) {
    return { error: String(error) }
  }
}

async function getPullRequestChanges(
  octokit: Octokit,
  repoName: string,
  prNumber: number
) {
  try {
    const [owner, repo] = repoName.split('/')
    const { data } = await octokit.rest.pulls.listFiles({
      owner,
      repo,
      pull_number: prNumber,
    })

    return data.map((file) => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      changes: file.changes,
      rawUrl: file.raw_url,
      blobUrl: file.blob_url,
      patch: file.patch,
    }))
  } catch (error) {
    return { error: String(error) }
  }
}

async function createIssue(
  octokit: Octokit,
  repoName: string,
  title: string,
  body?: string
) {
  try {
    const [owner, repo] = repoName.split('/')
    const { data } = await octokit.rest.issues.create({
      owner,
      repo,
      title,
      body,
    })

    return {
      id: data.id,
      number: data.number,
      title: data.title,
      body: data.body,
      url: data.html_url,
      state: data.state,
      createdAt: data.created_at,
      user: data.user?.login,
    }
  } catch (error) {
    return { error: String(error) }
  }
}

async function listIssues(octokit: Octokit, repoName: string, state: string) {
  try {
    const [owner, repo] = repoName.split('/')
    const { data } = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state: state as 'open' | 'closed' | 'all',
    })

    return data
      .filter((issue) => !issue.pull_request) // Filter out pull requests
      .map((issue) => ({
        number: issue.number,
        title: issue.title,
        user: issue.user?.login,
        createdAt: issue.created_at,
        state: issue.state,
        url: issue.html_url,
      }))
  } catch (error) {
    return { error: String(error) }
  }
}

async function getIssue(
  octokit: Octokit,
  repoName: string,
  issueNumber: number
) {
  try {
    const [owner, repo] = repoName.split('/')
    const { data } = await octokit.rest.issues.get({
      owner,
      repo,
      issue_number: issueNumber,
    })

    return {
      number: data.number,
      title: data.title,
      body: data.body,
      user: data.user?.login,
      state: data.state,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      url: data.html_url,
      assignees: data.assignees?.map((assignee) => assignee.login),
      labels: data.labels?.map((label) => {
        // Handle both string labels and label objects
        return typeof label === 'string' ? label : label.name
      }),
    }
  } catch (error) {
    return { error: String(error) }
  }
}

async function commentOnIssue(
  octokit: Octokit,
  repoName: string,
  issueNumber: number,
  body: string
) {
  try {
    const [owner, repo] = repoName.split('/')
    const { data } = await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body,
    })

    return {
      id: data.id,
      body: data.body,
      user: data.user?.login,
      createdAt: data.created_at,
      url: data.html_url,
    }
  } catch (error) {
    return { error: String(error) }
  }
}

async function closeIssue(
  octokit: Octokit,
  repoName: string,
  issueNumber: number
) {
  try {
    const [owner, repo] = repoName.split('/')
    await octokit.rest.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      state: 'closed',
    })
    return { message: `Issue #${issueNumber} closed.` }
  } catch (error) {
    return { error: String(error) }
  }
}

async function reopenIssue(
  octokit: Octokit,
  repoName: string,
  issueNumber: number
) {
  try {
    const [owner, repo] = repoName.split('/')
    await octokit.rest.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      state: 'open',
    })
    return { message: `Issue #${issueNumber} reopened.` }
  } catch (error) {
    return { error: String(error) }
  }
}

async function assignIssue(
  octokit: Octokit,
  repoName: string,
  issueNumber: number,
  assignees: string[]
) {
  try {
    const [owner, repo] = repoName.split('/')
    await octokit.rest.issues.addAssignees({
      owner,
      repo,
      issue_number: issueNumber,
      assignees,
    })
    return {
      message: `Issue #${issueNumber} assigned to ${assignees.join(', ')}.`,
    }
  } catch (error) {
    return { error: String(error) }
  }
}

async function labelIssue(
  octokit: Octokit,
  repoName: string,
  issueNumber: number,
  labels: string[]
) {
  try {
    const [owner, repo] = repoName.split('/')
    await octokit.rest.issues.setLabels({
      owner,
      repo,
      issue_number: issueNumber,
      labels,
    })
    return {
      message: `Labels ${labels.join(', ')} added to issue #${issueNumber}.`,
    }
  } catch (error) {
    return { error: String(error) }
  }
}

async function listIssueComments(
  octokit: Octokit,
  repoName: string,
  issueNumber: number
) {
  try {
    const [owner, repo] = repoName.split('/')
    const { data } = await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: issueNumber,
    })

    return data.map((comment) => ({
      id: comment.id,
      user: comment.user?.login,
      body: comment.body,
      createdAt: comment.created_at,
      url: comment.html_url,
    }))
  } catch (error) {
    return { error: String(error) }
  }
}

async function editIssue(
  octokit: Octokit,
  repoName: string,
  issueNumber: number,
  title?: string,
  body?: string
) {
  try {
    const [owner, repo] = repoName.split('/')
    await octokit.rest.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      ...(title && { title }),
      ...(body && { body }),
    })
    return { message: `Issue #${issueNumber} updated.` }
  } catch (error) {
    return { error: String(error) }
  }
}
