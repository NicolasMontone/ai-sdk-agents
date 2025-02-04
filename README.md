# AI SDK Tools Registry

This repository provides a collection of reusable "tools" that can be seamlessly integrated into an AI application using [shadcn](https://github.com/shadcn) or other CLI-based approaches. Each tool is defined with the necessary configuration and dependencies to give your AI application new capabilities, such as:

- Interacting with platforms like Slack, Discord, and Vercel
- Performing comprehensive web searches (Tavily, Perplexity)
- Managing GitHub repositories, issues, and pull requests
- Performing math calculations
- Searching and retrieving GIFs through Giphy
- And more...

## Getting Started

1. Pick the tool(s) you want to include in your AI application. Each "tool" is essentially a file (or set of files) that exports a "tool factory" function.
2. Copy the JSON registry file you want from the [public/r](./public/r) folder.
3. Use the [shadcn CLI](https://github.com/shadcn) (or a similar tool) to import the registry JSON into your AI SDK project.

For example, if you want to add the GitHub tools from this repository to your own project, you could run:

```bash
pnpm dlx shadcn@latest add https://ai-sdk-agents.vercel.app/r/math.json
```

(Feel free to replace "pnpm" with whichever package manager you prefer: npm, yarn, or bun.)

## Folder Structure

- **lib/tools**: Contains the TypeScript files that define each tool.
- **public/r**: Contains JSON registry files used to quickly add the tools to your project.
- **usage**: Contains example usage and endpoints for each tool.

## Contributing

Contributions, issues, and suggestions are welcome! If you'd like to add a new tool or improve an existing one:

1. Add a TypeScript file defining your tool's logic inside `lib/tools`.
2. Update `scripts/generateToolsRegistry.ts` to include your new tool and produce a corresponding `.json` file in `public/r`.
3. Open a pull request explaining your changes.

We appreciate your help in growing this tools registry, making it easier for developers to enhance their AI applications with minimal effort!
