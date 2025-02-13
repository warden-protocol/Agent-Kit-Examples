import { z } from "zod";
import { XAction } from "./x_action";
import { TwitterApi } from "twitter-api-v2";

const POST_TWEET_PROMPT = `
This tool will post a tweet on X. The tool takes the text of the tweet as input. Tweets can be maximum 280 characters.

A successful response will return a message with the API response as a JSON payload:
    {"data": {"text": "hello, world!", "id": "0123456789012345678", "edit_history_tweet_ids": ["0123456789012345678"]}}

A failure response will return a message with the Twitter API request error:
    You are not allowed to create a Tweet with duplicate content.
`;

export const PostTweetInput = z
    .object({
        tweet: z
            .string()
            .max(280, "Tweet must be a maximum of 280 characters."),
    })
    .strip()
    .describe("Input schema for posting a tweet");

/**
 * Posts a tweet on Twitter (X).
 *
 * @param client - The Twitter (X) client used to authenticate with.
 * @param args - The input arguments for the action.
 * @returns A message indicating the success or failure of the tweet posting.
 */
export async function postTweet(
    client: TwitterApi,
    args: z.infer<typeof PostTweetInput>
): Promise<string> {
    try {
        const response = await client.v2.tweet(args.tweet);
        return `Successfully posted to Twitter:\n${JSON.stringify(response)}`;
    } catch (error) {
        return `Error posting to Twitter:\n${error}`;
    }
}

/**
 * Post Tweet Action
 */
export class PostTweetAction implements XAction<typeof PostTweetInput> {
    public name = "post_tweet";
    public description = POST_TWEET_PROMPT;
    public schema = PostTweetInput;
    public func = postTweet;
}
