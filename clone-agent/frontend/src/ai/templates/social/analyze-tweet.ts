import { ToolConfig } from '../index';
import { retrieveTweetFromURL } from './functions/retrieve-tweet-data';

interface GetTweetArgs {
  url: string;
}

export const retrieveTweetTool: ToolConfig<GetTweetArgs> = {
  definition: {
    type: 'function',
    function: {
      name: 'get_tweet_data',
      description: 'Retrieve and format tweet data from a Twitter URL.',
      parameters: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'The Twitter API URL (e.g., https://api.brandbird.app/twitter/public/tweets/<tweet_id>)',
            pattern: '^https://api\\.brandbird\\.app/twitter/public/tweets/[0-9]+$'
          }
        },
        required: ['url']
      }
    }
  },
  handler: async (args: GetTweetArgs) => {
    try {
      return await retrieveTweetFromURL(args.url);
    } catch (error) {
      throw new Error(`Failed to retrieve Twitter data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};