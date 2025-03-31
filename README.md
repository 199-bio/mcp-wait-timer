# MCP Wait Timer Server
[![smithery badge](https://smithery.ai/badge/@199-bio/mcp-wait-timer)](https://smithery.ai/server/@199-bio/mcp-wait-timer)

An MCP (Model Context Protocol) server providing a simple `wait` tool.

Watch the demo video: [https://www.youtube.com/watch?v=TaF_j9wrWVw](https://www.youtube.com/watch?v=TaF_j9wrWVw)

## Overview

This server exposes a single tool, `wait`, designed to introduce deliberate pauses into workflows executed by MCP clients (e.g., Cline, Claude Desktop, Cursor).

## Problem Solved

MCP clients and the AI models driving them often operate sequentially. After executing a command or action (like a web request, file operation, or API call), the model might proceed to the next step immediately. However, some actions require additional time to fully complete their effects (e.g., background processes finishing, web pages fully rendering after JavaScript execution, file system propagation).

Since the model cannot always reliably detect when these asynchronous effects are complete, it might proceed prematurely, leading to errors or incorrect assumptions in subsequent steps.

## Solution: The `wait` Tool

This server provides a `wait` tool that allows the user or the AI prompt to explicitly instruct the client to pause for a specified duration before continuing. This ensures that time-dependent operations have sufficient time to complete.

**Tool:** `wait`
*   **Description:** Pauses execution for a specified number of seconds.
*   **Input Parameter:**
    *   `duration_seconds` (number, required): The duration to wait, in seconds. Must be a positive number.

## Use Cases

*   **Web Automation:** Ensure dynamic content loads or scripts finish executing after page navigation or element interaction.
    ```
    Example Prompt: "Navigate to example.com, fill the login form, click submit, then wait for 5 seconds and capture a screenshot."
    ```
*   **Command Line Operations:** Allow time for background tasks, file writes, or service startups initiated by a shell command.
    ```
    Example Prompt: "Run 'npm run build', wait for 15 seconds, then check if the 'dist/app.js' file exists."
    ```
*   **API Interaction:** Add delays between API calls to handle rate limiting or wait for asynchronous job completion.
*   **Workflow Debugging:** Insert pauses to observe the state of the system at specific points during a complex task.

## Installation & Setup

This server requires Node.js (version 16 or higher).

### Installing via Smithery

To install Wait Timer Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@199-bio/mcp-wait-timer):

```bash
npx -y @smithery/cli install @199-bio/mcp-wait-timer --client claude
```

### Step 1: Configure Your MCP Client

Add the following JSON block within the `"mcpServers": {}` object in your client's configuration file. Choose the file corresponding to your client and operating system:

**Configuration Block:**

```json
    "wait-timer": {
      "command": "npx",
      "args": ["mcp-wait-timer"],
      "env": {},
      "disabled": false,
      "autoApprove": []
    }
```

**Client Configuration File Locations:**

*   **Claude Desktop:**
    *   macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
    *   Windows: `%APPDATA%\Claude\claude_desktop_config.json`
    *   Linux: `~/.config/Claude/claude_desktop_config.json` *(Path may vary slightly)*

*   **VS Code Extension (Cline / "Claude Code"):**
    *   macOS: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
    *   Windows: `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
    *   Linux: `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

*   **Cursor:**
    *   Global: `~/.cursor/mcp.json`
    *   Project-Specific: Create a file at `.cursor/mcp.json` within your project folder.

*   **Windsurf:**
    *   `~/.codeium/windsurf/mcp_config.json`

*   **Other Clients:**
    *   Consult the specific client's documentation for the location of its MCP configuration file. The JSON structure shown in the "Configuration Block" above should generally work.

### Step 2: Restart Client

After adding the configuration block and saving the file, **fully restart** your MCP client application for the changes to take effect. The first time the client starts the server, `npx` will automatically download the `mcp-wait-timer` package if it's not already cached.

## Usage Example

Once installed and enabled, you can instruct your MCP client:

```
"Please wait for 10 seconds before proceeding."
```

The client's AI model should recognize the intent and call the `wait` tool with `duration_seconds: 10`.

## Developed By

This tool was developed as part of the initiatives at [199 Longevity](https://www.199.company), a group focused on extending the frontiers of human health and longevity.

Learn more about our work in biotechnology at [199.bio](https://www.199.bio).

Project contributor: Boris Djordjevic

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
