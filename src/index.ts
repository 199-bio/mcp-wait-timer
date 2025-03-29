#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  CallToolResult,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// --- Tool Logic ---

const waitInputSchemaShape = {
  duration_seconds: z.number().positive().describe('The number of seconds to wait'),
};
const waitInputSchema = z.object(waitInputSchemaShape);

async function waitHandler(args: z.infer<typeof waitInputSchema>): Promise<CallToolResult> {
  const { duration_seconds } = args;
  try {
    console.error(`[mcp-wait-timer] Waiting for ${duration_seconds} seconds...`);
    await new Promise(resolve => setTimeout(resolve, duration_seconds * 1000));
    console.error(`[mcp-wait-timer] Wait finished.`);
    return {
      isError: false,
      content: [{ type: 'text', text: `Successfully waited for ${duration_seconds} seconds.` }],
    };
  } catch (error: any) {
    console.error(`[mcp-wait-timer] Error during wait: ${error.message}`);
    // Ensure error responses also conform to CallToolResult
    return {
      isError: true,
      content: [{ type: 'text', text: `Error waiting: ${error.message}` }],
    };
  }
}

// --- Tool Definition ---

const WAIT_TOOL: Tool = {
  name: 'wait',
  description: 'Waits for a specified duration in seconds.',
  inputSchema: {
    type: 'object',
    properties: waitInputSchemaShape,
    required: ['duration_seconds'],
  },
};

// --- Server Setup ---

const server = new Server({
  name: 'mcp-wait-timer',
  version: '0.1.1', // Will update later before publishing
  // Capabilities are defined implicitly via setRequestHandler
});

// --- Request Handlers ---

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [WAIT_TOOL],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === WAIT_TOOL.name) {
    const parseResult = waitInputSchema.safeParse(request.params.arguments);
    if (!parseResult.success) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid arguments for tool ${WAIT_TOOL.name}: ${parseResult.error.message}`
      );
    }
    return waitHandler(parseResult.data);
  }
  throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
});

// --- Main Execution ---

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[mcp-wait-timer] Server running on stdio');
  // Keep alive
  await new Promise(() => {});
}

main().catch((error) => {
  console.error('[mcp-wait-timer] Fatal error:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.error('[mcp-wait-timer] SIGINT received, shutting down...');
  await server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error('[mcp-wait-timer] SIGTERM received, shutting down...');
  await server.close();
  process.exit(0);
});
