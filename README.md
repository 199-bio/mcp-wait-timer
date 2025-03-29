# MCP Wait Timer Server

An MCP (Model Context Protocol) server providing a simple `wait` tool.

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

## Installation

You need Node.js (version 16 or higher) installed.

There are two primary ways to configure your MCP client to use this server:

### Method 1: Using `npx` (Recommended)

This method runs the server directly from this project directory using `npx`. It's convenient as it doesn't require a separate build step after the initial setup.

1.  **Clone/Download:** Ensure you have this project directory (`mcp-wait-timer`) on your machine.
2.  **Install Dependencies:** Open a terminal *inside* the `mcp-wait-timer` directory and run:
    ```bash
    npm install
    ```
3.  **Build (First time only):** Run the build script once to ensure the executable is set up:
    ```bash
    npm run build
    ```
4.  **Configure Client:** Add the following configuration block to your MCP client's settings file (e.g., Cline's `cline_mcp_settings.json` or Claude Desktop's `claude_desktop_config.json`). **Replace `/path/to/your/mcp-wait-timer` with the actual absolute path** to this project directory.

    ```json
    "mcp-wait-timer": {
      "command": "npx",
      "args": ["."],
      "cwd": "/path/to/your/mcp-wait-timer", // <-- IMPORTANT: Set absolute path here
      "env": {},
      "disabled": false,
      "autoApprove": []
    }
    ```
    *   `command: "npx"`: Tells the client to use the `npx` command runner.
    *   `args: ["."]` : Tells `npx` to execute the package defined in the current directory (specified by `cwd`).
    *   `cwd`: Specifies the working directory where `npx .` should run. **This must be the absolute path to this project.**

5.  **Restart Client:** Save the configuration file and fully restart your MCP client application.

### Method 2: Manual Configuration (Using Node)

This method uses the pre-built JavaScript file.

1.  **Clone/Download & Build:** Ensure you have this project directory and have run `npm install` and `npm run build` inside it. This creates the `build/index.js` file.
2.  **Find Absolute Path:** Note the **absolute path** to the `build/index.js` file within this project directory.
3.  **Configure Client:** Add the following configuration block to your MCP client's settings file. **Replace `/path/to/your/mcp-wait-timer/build/index.js` with the actual absolute path.**

    ```json
    "mcp-wait-timer": {
      "command": "node",
      "args": ["/path/to/your/mcp-wait-timer/build/index.js"], // <-- IMPORTANT: Set absolute path here
      "env": {},
      "disabled": false,
      "autoApprove": []
    }
    ```
4.  **Restart Client:** Save the configuration file and fully restart your MCP client application.

## Usage Example

Once installed and enabled, you can instruct your MCP client:

```
"Please wait for 10 seconds before proceeding."
```

The client's AI model should recognize the intent and call the `wait` tool with `duration_seconds: 10`.
