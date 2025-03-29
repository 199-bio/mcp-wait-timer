#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
// --- Tool Definition ---
const waitInputSchemaShape = {
    duration_seconds: z.number().positive().describe('The number of seconds to wait'),
};
const waitInputSchema = z.object(waitInputSchemaShape); // Keep this for type inference if needed elsewhere
async function waitHandler(args) {
    const { duration_seconds } = args;
    try {
        console.error(`[mcp-wait-timer] Waiting for ${duration_seconds} seconds...`);
        await new Promise(resolve => setTimeout(resolve, duration_seconds * 1000));
        console.error(`[mcp-wait-timer] Wait finished.`);
        return {
            isError: false, // Explicitly set isError to false on success
            content: [{ type: 'text', text: `Successfully waited for ${duration_seconds} seconds.` }],
        };
    }
    catch (error) {
        console.error(`[mcp-wait-timer] Error during wait: ${error.message}`);
        return {
            isError: true,
            content: [{ type: 'text', text: `Error waiting: ${error.message}` }],
        };
    }
}
// --- Server Setup ---
const server = new McpServer({
    name: 'mcp-wait-timer',
    version: '0.1.0',
    capabilities: {
        tools: {}, // Tools are registered below
    },
});
server.tool('wait', 'Waits for a specified duration in seconds.', waitInputSchemaShape, // Use the raw shape here
waitHandler);
// --- Main Execution ---
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('[mcp-wait-timer] Server running on stdio');
    // Keep the process alive indefinitely until terminated via signal
    await new Promise(() => { });
}
main().catch((error) => {
    console.error('[mcp-wait-timer] Fatal error in main():', error);
    process.exit(1);
});
// Handle graceful shutdown
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
