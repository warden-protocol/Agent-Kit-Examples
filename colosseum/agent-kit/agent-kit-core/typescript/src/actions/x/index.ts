import { XAction, XActionSchemaAny } from "./x_action";
import { PostTweetAction } from "./post_tweet";

export function getAllXActions(): XAction<XActionSchemaAny>[] {
    return [new PostTweetAction()];
}

/**
 * All available X actions.
 */
export const X_ACTIONS = getAllXActions();

/**
 * All X action types.
 */
export { XAction, PostTweetAction };
