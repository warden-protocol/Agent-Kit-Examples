import axios from 'axios';

/**
 * Fetches and formats tweet data from the Brandbird API.
 * @param url - The Twitter URL (e.g., https://api.brandbird.app/twitter/public/tweets/<tweet_id>).
 * @returns A promise that resolves to a formatted string with the tweet data.
 */
export async function retrieveTweetFromURL(url: string): Promise<string> {
  try {
    const tweetId = url.split('/').pop();
    const apiUrl = `https://api.brandbird.app/twitter/public/tweets/${tweetId}`;

    const response = await axios.get(apiUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    const tweet = response.data?.tweet;

    if (!tweet) {
      throw new Error('Tweet data is missing in the response.');
    }

    const username = tweet.username || 'N/A';
    const name = tweet.name || 'N/A';
    const profileImage = tweet.user?.profile_image_url_https || tweet.avatar || 'N/A';
    const text = tweet.text || 'N/A';
    const mediaUrl = tweet.mediaDetails?.[0]?.media_url_https || 'N/A';
    const likes = tweet.likes || 0;
    const replies = tweet.replies || 0;
    const createdAt = tweet.createdAt ? new Date(tweet.createdAt).toLocaleString() : 'N/A';
    const isBlueVerified = tweet.isBlueVerified ? 'Yes' : 'No';

    const images = tweet.images?.join(', ') || 'N/A';
    const videos = tweet.video?.map((v: { src: string }) => v.src).join(', ') || 'N/A';

    const totalInteractions = likes + replies;

    const result = `
Username: ${username}
Name: ${name}
Profile Picture: ${profileImage}
Text: ${text}
Likes: ${likes}
Replies: ${replies}
Total Interactions: ${totalInteractions}
Created At: ${createdAt}
Blue Verified: ${isBlueVerified}
Images: ${images}
Videos: ${videos}
Media URL: ${mediaUrl}
`;

    return result.trim();
  } catch (error: any) {
    console.error('Error fetching tweet data:', error.message);
    throw new Error('Failed to retrieve tweet data.');
  }
}