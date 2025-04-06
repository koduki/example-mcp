import {
  Server,
  ToolBuilder,
  ToolResult,
  ToolInputBuilder,
  ProgressNotification
} from '@modelcontextprotocol/sdk';

type ToolInputs = Record<string, any>;
type ProgressHandler = { send: (notification: ProgressNotification) => void };

export function registerTools(server: Server): void {
  server.registerTool(
    new ToolBuilder()
      .setName('echo')
      .setDescription('Echoes back the provided message')
      .addInput(
        new ToolInputBuilder()
          .setName('message')
          .setDescription('Message to echo back')
          .setRequired(true)
          .setType('string')
          .build()
      )
      .setHandler(async ({ inputs }: { inputs: ToolInputs }) => 
        ToolResult.withTextContent(`Echo: ${inputs.message}`)
      )
      .build()
  );

  server.registerTool(
    new ToolBuilder()
      .setName('add')
      .setDescription('Adds two numbers together')
      .addInput(
        new ToolInputBuilder()
          .setName('a')
          .setDescription('First number')
          .setRequired(true)
          .setType('number')
          .build()
      )
      .addInput(
        new ToolInputBuilder()
          .setName('b')
          .setDescription('Second number')
          .setRequired(true)
          .setType('number')
          .build()
      )
      .setHandler(async ({ inputs }: { inputs: ToolInputs }) => 
        ToolResult.withTextContent(`Result: ${inputs.a + inputs.b}`)
      )
      .build()
  );

  server.registerTool(
    new ToolBuilder()
      .setName('longRunningOperation')
      .setDescription('Demonstrates a long-running operation with progress updates')
      .addInput(
        new ToolInputBuilder()
          .setName('duration')
          .setDescription('Duration in seconds')
          .setRequired(false)
          .setType('number')
          .setDefaultValue(10)
          .build()
      )
      .addInput(
        new ToolInputBuilder()
          .setName('steps')
          .setDescription('Number of progress steps')
          .setRequired(false)
          .setType('number')
          .setDefaultValue(5)
          .build()
      )
      .setHandler(async ({ inputs, progress }: { inputs: ToolInputs; progress: ProgressHandler }) => {
        const stepDuration = Math.floor(inputs.duration * 1000 / inputs.steps);

        for (let i = 1; i <= inputs.steps; i++) {
          await new Promise(resolve => setTimeout(resolve, stepDuration));
          progress.send(
            new ProgressNotification(
              `Completed step ${i} of ${inputs.steps}`,
              (i / inputs.steps) * 100
            )
          );
        }

        return ToolResult.withTextContent(
          `Completed operation with ${inputs.steps} steps over ${inputs.duration} seconds`
        );
      })
      .build()
  );
}
