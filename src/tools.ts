import {
  Server,
  ToolBuilder,
  ToolResult,
  ToolInputBuilder,
  ProgressNotification
} from '@modelcontextprotocol/sdk';

type ToolInputs = Record<string, unknown>;
type ProgressHandler = { send: (notification: ProgressNotification) => void };

export function registerTools(server: Server): void {
  const echoTool = new ToolBuilder()
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
      ToolResult.withTextContent(`Echo: ${inputs.message as string}`)
    )
    .build();

  const addTool = new ToolBuilder()
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
    .setHandler(async ({ inputs }: { inputs: ToolInputs }) => {
      const result = (inputs.a as number) + (inputs.b as number);
      return ToolResult.withTextContent(`Result: ${result}`);
    })
    .build();

  const longRunningTool = new ToolBuilder()
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
      const duration = inputs.duration as number;
      const steps = inputs.steps as number;
      const stepDuration = Math.floor(duration * 1000 / steps);

      for (let i = 1; i <= steps; i++) {
        await new Promise(resolve => setTimeout(resolve, stepDuration));
        progress.send(
          new ProgressNotification(
            `Completed step ${i} of ${steps}`,
            (i / steps) * 100
          )
        );
      }

      return ToolResult.withTextContent(
        `Completed operation with ${steps} steps over ${duration} seconds`
      );
    })
    .build();

  [echoTool, addTool, longRunningTool].forEach(tool => server.registerTool(tool));
}
