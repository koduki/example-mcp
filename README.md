# example-mcp

An example implementation of a Model Context Protocol (MCP) server.

## Overview

This project demonstrates how to build an MCP server using TypeScript and the official MCP SDK. The server implements:

- Several tools (echo, add, long-running operation)
- Text resources with subscription capabilities
- Simple and complex prompt templates

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## Usage with Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "example": {
      "command": "node",
      "args": [
        "dist/index.js"
      ],
      "cwd": "/path/to/example-mcp"
    }
  }
}
```

## Available Tools

- `echo`: Echoes back the provided message
- `add`: Adds two numbers together
- `longRunningOperation`: Demonstrates progress notifications for long operations

## Available Resources

- `example://text/{id}`: Example text resources that can be accessed and subscribed to

## Available Prompts

- `simple_prompt`: A basic prompt without arguments
- `complex_prompt`: A prompt that demonstrates argument handling
