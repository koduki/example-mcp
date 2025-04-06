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

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8000;

const server = new ServerBuilder()
  .setName('example-mcp')
  .setDescription('Example MCP server implementation')
  .setVersion('0.1.0')
  .setDefaultLoggingLevel(LoggingLevel.INFO)
  .build();

registerTools(server);
registerResources(server);
registerPrompts(server);

const apiServer = new ApiServer(
  server,
  createExpressAdapter(app)
);

apiServer.start().then(() => {
  console.log(`MCP server started on port ${PORT}`);
  app.listen(PORT);
}).catch((error: unknown) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
