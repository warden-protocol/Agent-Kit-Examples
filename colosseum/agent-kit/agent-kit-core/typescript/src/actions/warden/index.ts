import { WardenAction, WardenActionSchemaAny } from "./warden_action";
import { GetSpacesAction } from "./get_spaces";
import { CreateSpaceAction } from "./create_space";
import { GetKeysAction } from "./get_keys";
import { CreateKeyAction } from "./create_key";
import { GetKeychainsAction } from "./get_keychains";
import { GetBalanceAction } from "./get_balance";
import { RequestFundsAction } from "./request_funds";
import { GetPriceAction } from "./get_price";
import { SendTokenAction } from "./send_token";
import { CreateOrderAction } from "./create_order";
/**
 * Retrieves all Warden action instances.
 *
 * @returns - Array of Warden action instances
 */
export function getAllWardenActions(): WardenAction<WardenActionSchemaAny>[] {
    return [
        new GetSpacesAction(),
        new CreateSpaceAction(),
        new GetKeysAction(),
        new CreateKeyAction(),
        new GetKeychainsAction(),
        new GetBalanceAction(),
        new RequestFundsAction(),
        new GetPriceAction(),
        new SendTokenAction(),
        new CreateOrderAction(),
    ];
}

export const WARDEN_ACTIONS = getAllWardenActions();

export { WardenAction, WardenActionSchemaAny, GetSpacesAction };
