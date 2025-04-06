import {
  Server,
  ResourceContent,
  ResourceContentType,
  ResourceDescription,
  ResourceGetter,
  ResourceSubscription
} from '@modelcontextprotocol/sdk';

export function registerResources(server: Server): void {
  server.registerResourceGetter('example', {
    async getResource(uri: string): Promise<ResourceContent> {
      const match = uri.match(/^example:\/\/text\/(\d+)$/);
      if (!match) throw new Error(`Invalid resource URI: ${uri}`);

      const id = parseInt(match[1], 10);
      
      return {
        type: ResourceContentType.TEXT,
        data: `This is example text resource #${id}`,
        metadata: { id, createdAt: new Date().toISOString() }
      };
    },

    async listResources(pageSize: number, pageToken?: string): Promise<{ 
      resources: ResourceDescription[], 
      nextPageToken?: string 
    }> {
      const startIndex = pageToken ? parseInt(pageToken, 10) : 0;
      const resources = [];
      
      for (let i = 0; i < Math.min(pageSize, 10 - startIndex); i++) {
        resources.push({
          uri: `example://text/${startIndex + i}`,
          name: `Example Text Resource ${startIndex + i}`,
          description: `An example text resource with ID ${startIndex + i}`
        });
      }

      return { 
        resources, 
        nextPageToken: startIndex + pageSize < 10 ? (startIndex + pageSize).toString() : undefined 
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
        subscription.update({
          type: ResourceContentType.TEXT,
          data: `This is example text resource #${id} (updated at ${new Date().toISOString()})`,
          metadata: { id, updatedAt: new Date().toISOString() }
        });
      }, 5000);

      subscription.onCancel(() => clearInterval(interval));
    }
  });
}
