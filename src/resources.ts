import {
  Server,
  ResourceContent,
  ResourceContentType,
  ResourceDescription,
  ResourceGetter,
  ResourceSubscription
} from '@modelcontextprotocol/sdk';

const RESOURCE_URI_SCHEME = 'example';

/**
 * Register all resources with the MCP server
 */
export function registerResources(server: Server): void {
  const staticTextResourceGetter: ResourceGetter = {
    async getResource(uri: string): Promise<ResourceContent> {
      const match = uri.match(/^example:\/\/text\/(\d+)$/);
      if (!match) {
        throw new Error(`Invalid resource URI: ${uri}`);
      }

      const id = parseInt(match[1], 10);
      const content = `This is example text resource #${id}`;

      return {
        type: ResourceContentType.TEXT,
        data: content,
        metadata: {
          id,
          createdAt: new Date().toISOString()
        }
      };
    },

    async listResources(pageSize: number, pageToken?: string): Promise<{ resources: ResourceDescription[], nextPageToken?: string }> {
      const startIndex = pageToken ? parseInt(pageToken, 10) : 0;
      const resources: ResourceDescription[] = [];

      for (let i = startIndex; i < startIndex + pageSize && i < 10; i++) {
        resources.push({
          uri: `example://text/${i}`,
          name: `Example Text Resource ${i}`,
          description: `An example text resource with ID ${i}`
        });
      }

      const nextPageToken = startIndex + pageSize < 10 ? (startIndex + pageSize).toString() : undefined;

      return {
        resources,
        nextPageToken
      };
    },

    async subscribeToResource(uri: string, subscription: ResourceSubscription): Promise<void> {
      const interval = setInterval(() => {
        const match = uri.match(/^example:\/\/text\/(\d+)$/);
        if (!match) {
          clearInterval(interval);
          return;
        }

        const id = parseInt(match[1], 10);
        const content = `This is example text resource #${id} (updated at ${new Date().toISOString()})`;

        subscription.update({
          type: ResourceContentType.TEXT,
          data: content,
          metadata: {
            id,
            updatedAt: new Date().toISOString()
          }
        });
      }, 5000);

      subscription.onCancel(() => {
        clearInterval(interval);
      });
    }
  };

  server.registerResourceGetter(RESOURCE_URI_SCHEME, staticTextResourceGetter);
}
