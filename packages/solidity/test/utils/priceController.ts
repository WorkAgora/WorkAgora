import { BigNumber } from "bignumber.js";
import { PaymentToken } from "../../scripts/utils/types";
import { tokensDecimals } from "../../scripts/utils/tokens";

export function getPriceUnits(priceDecimal: number, token: PaymentToken): BigNumber {
    return new BigNumber(priceDecimal)
        .times(10 ** tokensDecimals.find(t => t.token === token)!.decimals);
}
