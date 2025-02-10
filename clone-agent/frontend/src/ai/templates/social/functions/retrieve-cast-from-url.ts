import axios from 'axios';

interface CastData {
  result: {
    cast: {
      hash: string;
      text: string;
      embeds?: {
        images?: Array<{
          url?: string;
          sourceUrl?: string;
          originalUrl?: string;
        }>;
      };
      mentions?: Array<{
        username?: string;
        displayName?: string;
        followingCount?: number;
        followerCount?: number;
        pfp?: {
          url?: string;
        };
        bio?: {
          text?: string;
        };
        connectedAddress?: string;
      }>;
      author: {
        username: string;
        displayName?: string;
        followingCount?: number;
        followerCount?: number;
        pfp?: {
          url?: string;
        };
        bio?: {
          text?: string;
        };
        connectedAddress: string | null;
      };
      replies?: {
        count?: number;
      };
      recasts?: {
        count?: number;
      };
      reactions?: {
        count?: number;
      };
      channel?: {
        channelId?: string;
        name?: string;
        description?: string;
        imageUrl?: string;
        followerCount?: number;
      };
    };
  };
  source: string;
}

/**
 * Fetches and formats the cast data from Farcaster API to a string.
 * @param url - The Farcaster URL (e.g., https://warpcast.com/<username>/<short_hash>).
 * @returns A promise that resolves to a formatted string with only the available cast data.
 */
export async function retrieveCastFromURL(url: string): Promise<string> {
  try {
    const urlParts = url.split('/');
    const username = urlParts[urlParts.length - 2];
    const shortHash = urlParts[urlParts.length - 1];

    const apiUrl = `https://build.wield.xyz/farcaster/v2/cast-short?shortHash=${shortHash}&username=${username}`;

    const response = await axios.get<CastData>(apiUrl, {
      headers: {
        'API-KEY': process.env.WEILD_API_KEY || '',
        Accept: 'application/json',
      },
    });

    const cast = response.data.result.cast;

    const images = cast.embeds?.images?.map((image) => {
      return `URL: ${image.url || 'N/A'}, Source URL: ${image.sourceUrl || 'N/A'}, Original URL: ${image.originalUrl || 'N/A'}`;
    }).join(', ') || 'No images';

    const mentions = cast.mentions?.map((mention) => {
      return `Username: ${mention.username || 'N/A'}, Display Name: ${mention.displayName || 'N/A'}, Following Count: ${mention.followingCount || 0}, Follower Count: ${mention.followerCount || 0}`;
    }).join(', ') || 'No mentions';

    const author = cast.author;
    const channel = cast.channel;

    const resultString = `
      Hash: ${cast.hash},
      Text: ${cast.text},
      Images: ${images},
      Mentions: ${mentions},
      Author Username: ${author.username},
      Author Display Name: ${author.displayName || 'N/A'},
      Author Following Count: ${author.followingCount || 0},
      Author Follower Count: ${author.followerCount || 0},
      Author PFP URL: ${author.pfp?.url || 'N/A'},
      Author Bio: ${author.bio?.text || 'N/A'},
      Author Connected Address: ${author.connectedAddress || 'N/A'},
      Replies Count: ${cast.replies?.count || 0},
      Recast Count: ${cast.recasts?.count || 0},
      Reactions Count: ${cast.reactions?.count || 0},
      Channel ID: ${channel?.channelId || 'N/A'},
      Channel Name: ${channel?.name || 'N/A'},
      Channel Description: ${channel?.description || 'N/A'},
      Channel Logo URL: ${channel?.imageUrl || 'N/A'},
      Channel Follower Count: ${channel?.followerCount || 0}
    `;

    return resultString;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}