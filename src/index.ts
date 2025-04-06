import express from 'express';
import cors from 'cors';
import {
  ApiServer,
  createExpressAdapter,
  LoggingLevel,
  ServerBuilder
} from '@modelcontextprotocol/sdk';

import { registerTools } from './tools';
import { registerResources } from './resources';
import { registerPrompts } from './prompts';

const PORT = process.env.PORT || 8000;
const SERVER_NAME = 'example-mcp';
const SERVER_DESCRIPTION = 'Example MCP server implementation';
const SERVER_VERSION = '0.1.0';

const app = express();
app.use(cors());

const server = new ServerBuilder()
  .setName(SERVER_NAME)
  .setDescription(SERVER_DESCRIPTION)
  .setVersion(SERVER_VERSION)
  .setDefaultLoggingLevel(LoggingLevel.INFO)
  .build();

registerTools(server);
registerResources(server);
registerPrompts(server);

const apiServer = new ApiServer(server, createExpressAdapter(app));

apiServer.start()
  .then(() => {
    console.log(`MCP server started on port ${PORT}`);
    app.listen(PORT);
  })
  .catch((error: unknown) => {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  });
