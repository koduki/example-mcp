import {
  Server,
  ResourceContent,
  ResourceContentType,
  ResourceDescription,
  ResourceGetter,
  ResourceSubscription
} from '@modelcontextprotocol/sdk';

const RESOURCE_URI_SCHEME = 'example';
const RESOURCE_URI_PATTERN = /^example:\/\/text\/(\d+)$/;
const MAX_RESOURCES = 10;
const UPDATE_INTERVAL_MS = 5000;

export function registerResources(server: Server): void {
  const staticTextResourceGetter: ResourceGetter = {
    async getResource(uri: string): Promise<ResourceContent> {
      const match = uri.match(RESOURCE_URI_PATTERN);
      if (!match) throw new Error(`Invalid resource URI: ${uri}`);

      const id = parseInt(match[1], 10);
      
      return {
        type: ResourceContentType.TEXT,
        data: `This is example text resource #${id}`,
        metadata: {
          id,
          createdAt: new Date().toISOString()
        }
      };
    },

    async listResources(pageSize: number, pageToken?: string): Promise<{ 
      resources: ResourceDescription[], 
      nextPageToken?: string 
    }> {
      const startIndex = pageToken ? parseInt(pageToken, 10) : 0;
      const resources = Array.from(
        { length: Math.min(pageSize, MAX_RESOURCES - startIndex) },
        (_, i) => ({
          uri: `example://text/${startIndex + i}`,
          name: `Example Text Resource ${startIndex + i}`,
          description: `An example text resource with ID ${startIndex + i}`
        })
      );

      const nextPageToken = startIndex + pageSize < MAX_RESOURCES 
        ? (startIndex + pageSize).toString() 
        : undefined;

      return { resources, nextPageToken };
    },

    async subscribeToResource(uri: string, subscription: ResourceSubscription): Promise<void> {
      const interval = setInterval(() => {
        const match = uri.match(RESOURCE_URI_PATTERN);
        if (!match) {
          clearInterval(interval);
          return;
        }

        const id = parseInt(match[1], 10);
        subscription.update({
          type: ResourceContentType.TEXT,
          data: `This is example text resource #${id} (updated at ${new Date().toISOString()})`,
          metadata: {
            id,
            updatedAt: new Date().toISOString()
          }
        });
      }, UPDATE_INTERVAL_MS);

      subscription.onCancel(() => clearInterval(interval));
    }
  };

  server.registerResourceGetter(RESOURCE_URI_SCHEME, staticTextResourceGetter);
}
