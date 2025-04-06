import {
  Server,
  PromptBuilder,
  PromptInputBuilder,
  PromptTemplate
} from '@modelcontextprotocol/sdk';

type PromptArgs = Record<string, unknown> | undefined;

export function registerPrompts(server: Server): void {
  const simplePrompt = new PromptBuilder()
    .setName('simple_prompt')
    .setDescription('A simple prompt without arguments')
    .setTemplate(
      new PromptTemplate([
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello! Can you help me with something?' },
        { role: 'assistant', content: 'I would be happy to help you with anything you need. What can I assist you with today?' }
      ])
    )
    .build();

  const complexPrompt = new PromptBuilder()
    .setName('complex_prompt')
    .setDescription('A complex prompt that takes arguments')
    .addInput(
      new PromptInputBuilder()
        .setName('temperature')
        .setDescription('Temperature setting for model')
        .setRequired(true)
        .setType('number')
        .build()
    )
    .addInput(
      new PromptInputBuilder()
        .setName('style')
        .setDescription('Style of response')
        .setRequired(false)
        .setType('string')
        .setDefaultValue('neutral')
        .build()
    )
    .setTemplate((args: PromptArgs) => {
      const temperature = args?.temperature as number;
      const style = args?.style as string || 'neutral';
      
      return new PromptTemplate([
        { 
          role: 'system', 
          content: `You are a helpful assistant. Respond in a ${style} style. Use a temperature setting of ${temperature}.` 
        },
        { 
          role: 'user', 
          content: 'Tell me about the Model Context Protocol.' 
        },
        { 
          role: 'assistant', 
          content: 'The Model Context Protocol (MCP) is a protocol that enables secure and controlled access to tools and data sources for LLMs. It provides a standardized way for AI models to interact with various services and resources.' 
        },
        { 
          role: 'user', 
          content: 'How can I implement an MCP server?' 
        },
        { 
          role: 'assistant', 
          content: 'You can implement an MCP server using either the TypeScript or Python SDK provided by the Model Context Protocol. These SDKs make it easy to create servers that expose tools, resources, and prompts to MCP clients.' 
        }
      ]);
    })
    .build();

  [simplePrompt, complexPrompt].forEach(prompt => server.registerPrompt(prompt));
}
