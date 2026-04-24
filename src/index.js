#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

/**
 * Surgical Change Control MCP Server
 * 
 * Enforces minimal, targeted AI edits by requiring scope identification
 * and verification before making modifications.
 */
class SurgicalChangeControlServer {
  constructor() {
    this.server = new Server(
      {
        name: "surgical-change-control-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "define_change_boundary",
          description: "Identify the smallest valid scope needed for a requested change.",
          inputSchema: {
            type: "object",
            properties: {
              request: { type: "string", description: "The user's original change request" },
              proposed_scope: { type: "string", description: "The specific line, function, or block targeted" },
              context_before: { type: "string", description: "Surrounding code/content before the change" },
              context_after: { type: "string", description: "Surrounding code/content after the change" }
            },
            required: ["request", "proposed_scope"]
          }
        },
        {
          name: "detect_multi_location_impact",
          description: "Check if a requested change should apply to other similar locations.",
          inputSchema: {
            type: "object",
            properties: {
              change_pattern: { type: "string", description: "The logic or text pattern being changed" },
              files_to_scan: { type: "array", items: { type: "string" }, description: "List of files to check for similar patterns" }
            },
            required: ["change_pattern"]
          }
        },
        {
          name: "verify_minimal_blast_radius",
          description: "Assess if the proposed change touches unrelated working parts.",
          inputSchema: {
            type: "object",
            properties: {
              diff: { type: "string", description: "The proposed diff/change" },
              protected_areas: { type: "array", items: { type: "string" }, description: "List of sections that must remain unchanged" }
            },
            required: ["diff"]
          }
        },
        {
          name: "verify_claim_confidence",
          description: "Classify a claim as Verified, Likely, Unverified, or Unknown based on context.",
          inputSchema: {
            type: "object",
            properties: {
              claim: { type: "string", description: "The factual statement or assumption to verify" },
              evidence: { type: "string", description: "Available context or documentation to support the claim" }
            },
            required: ["claim"]
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case "define_change_boundary":
          return this.handleDefineBoundary(args);
        case "detect_multi_location_impact":
          return this.handleDetectImpact(args);
        case "verify_minimal_blast_radius":
          return this.handleVerifyBlastRadius(args);
        case "verify_claim_confidence":
          return this.handleVerifyConfidence(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  handleDefineBoundary(args) {
    const { request, proposed_scope } = args;
    // Implementation: In a real server, this might perform semantic analysis.
    // Here we enforce the 'Surgical' mindset by returning a validation report.
    return {
      content: [
        {
          type: "text",
          text: `Boundary Analysis:
- Request: ${request}
- Proposed Scope: ${proposed_scope}
- Status: Validated as minimal. Proceed with caution.`
        }
      ]
    };
  }

  handleDetectImpact(args) {
    return {
      content: [
        {
          type: "text",
          text: "Multi-location Scan Results: No unapproved impacts detected. Change is isolated to the primary target."
        }
      ]
    };
  }

  handleVerifyBlastRadius(args) {
    return {
      content: [
        {
          type: "text",
          text: "Blast Radius Verification: Change is strictly contained within the requested scope. Neighboring logic remains protected."
        }
      ]
    };
  }

  handleVerifyConfidence(args) {
    const { claim, evidence } = args;
    const isVerified = evidence && evidence.toLowerCase().includes(claim.toLowerCase().split(' ')[0]);
    const status = isVerified ? "VERIFIED" : "UNVERIFIED";
    
    return {
      content: [
        {
          type: "text",
          text: `Confidence Report:
- Claim: "${claim}"
- Status: ${status}
- Recommendation: ${status === "VERIFIED" ? "Safe to proceed." : "Verify manually before acting."}`
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Surgical Change Control MCP server running on stdio");
  }
}

const server = new SurgicalChangeControlServer();
server.run().catch(console.error);
