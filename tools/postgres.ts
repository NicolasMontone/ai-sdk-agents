import { type Tool, tool } from 'ai'
import { z } from 'zod'
import { Client as PGClient } from 'pg'

type PGTools = 'getPublicTablesWithColumns' | 'getExplainForQuery' | 'runQuery'

export const postgresTools = (
  { connectionString }: { connectionString: string },
  config?: {
    excludeTools?: PGTools[]
  }
): Partial<Record<PGTools, Tool>> => {
  const tools: Partial<Record<PGTools, Tool>> = {
    getPublicTablesWithColumns: tool({
      description: 'Get all public tables with columns',
      parameters: z.object({}),
      execute: async () => {
        const tables = await getPublicTablesWithColumns(connectionString)
        return tables
      },
    }),
    getExplainForQuery: tool({
      description:
        "Analyzes and optimizes a given SQL query, providing a detailed execution plan in JSON format. If the query is not valid, it should return an error message. The function itself will add the EXPLAIN keyword to the query, so you don't need to include it.",
      parameters: z.object({
        query: z.string().describe('The SQL query to analyze'),
      }),
      execute: async ({ query }) => {
        const explain = await getExplainForQuery(query, connectionString)
        return explain
      },
    }),
    runQuery: tool({
      description: 'Run a SQL query and return the result',
      parameters: z.object({
        query: z.string().describe('The SQL query to run'),
      }),
      execute: async ({ query }) => {
        const result = await runQuery(query, connectionString)
        return result
      },
    }),
  }

  for (const toolName in tools) {
    if (config?.excludeTools?.includes(toolName as PGTools)) {
      delete tools[toolName as PGTools]
    }
  }

  return tools
}

async function getPublicTablesWithColumns(connectionString: string) {
  const client = new PGClient(connectionString)
  await client.connect()

  try {
    // Get tables
    const tablesRes = await client.query(`
        SELECT table_name, table_schema
        FROM information_schema.tables
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY table_schema, table_name
      `)

    // Get columns for each table
    const tablesWithColumns = await Promise.all(
      tablesRes.rows.map(async (table) => {
        const columnsRes = await client.query(
          `
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_schema = $1 AND table_name = $2
          ORDER BY ordinal_position
        `,
          [table.table_schema, table.table_name]
        )

        return {
          tableName: table.table_name,
          schemaName: table.table_schema,
          columns: columnsRes.rows.map((col) => ({
            name: col.column_name,
            type: col.data_type,
            isNullable: col.is_nullable === 'YES',
          })),
        }
      })
    )

    await client.end()

    return tablesWithColumns
  } catch (error) {
    console.error('Error fetching tables with columns:', error)
    await client.end()
    return `Error fetching tables with columns: ${error}`
  }
}

async function getExplainForQuery(query: string, connectionString: string) {
  const explainAnalyzeRegex = /explain\s+analyze\s+(.*)/i
  const explainRegex = /explain\s+(.*)/i

  let queryToRun = query

  const match =
    queryToRun.match(explainAnalyzeRegex) || queryToRun.match(explainRegex)

  if (match) {
    // Remove EXPLAIN or EXPLAIN ANALYZE
    queryToRun = match[1].trim()
  }

  const client = new PGClient(connectionString)

  try {
    await client.connect()

    const explain = await client.query(`EXPLAIN (FORMAT JSON) ${queryToRun}`)
    await client.end()

    return explain.rows[0]['QUERY PLAN']
  } catch (error) {
    console.error('Error running EXPLAIN:', error)
    await client.end()
    return `Error running EXPLAIN: ${error}`
  }
}

async function runQuery(query: string, connectionString: string) {
  const client = new PGClient(connectionString)
  try {
    await client.connect()
    const result = await client.query(query)

    return result.rows
  } catch (error) {
    console.error('Error running query:', error)

    return `Error running query: ${error}`
  } finally {
    await client.end()
  }
}
