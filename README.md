# Surgical Change Control MCP Server

An [MCP](https://modelcontextprotocol.io) server implementation of the **Surgical Change Control** skill. This server provides tools to enforce disciplined, minimal AI edits by requiring scope validation and factual verification before modifications are applied.

## Tools

- `define_change_boundary`: Validates the smallest possible scope for a requested change.
- `detect_multi_location_impact`: Scans for similar patterns across files to prevent unapproved bulk edits.
- `verify_minimal_blast_radius`: Ensures proposed changes don't touch unrelated working code.
- `verify_claim_confidence`: Classifies claims as Verified, Likely, or Unverified to prevent hallucination-driven edits.

## Installation

### For Perplexity Mac App (Desktop)

1. Ensure you have [PerplexityXPC](https://github.com/perplexity-ai/PerplexityXPC) installed.
2. Go to **Settings → Connectors** in the Perplexity Mac app.
3. Click **Add Connector**.
4. Add the following command:
   ```bash
   npx -y surgical-change-control-mcp
   ```
   *(Note: This assumes the package is published to npm. For local development, use the absolute path to your `src/index.js`)*.
5. Save and wait for the status to show **Running**.

### For Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "surgical-change-control": {
      "command": "node",
      "args": ["/path/to/surgical-change-control-mcp/src/index.js"]
    }
  }
}
```

## Development

```bash
npm install
npm start
```

## License

MIT
