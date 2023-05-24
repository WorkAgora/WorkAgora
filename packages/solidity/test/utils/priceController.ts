import { BigNumber } from "bignumber.js";

export enum PaymentToken {
    Avax = 0,
    Link = 1
}

export const tokensInfo = [
    {
        token: PaymentToken.Avax,
        decimals: 18,
        price: new BigNumber('0.068'), // 1 AVAX = $14.62 USD -> $1 USD = 0.068 AVAX
    },
    {
        token: PaymentToken.Link,
        decimals: 18,
        price: new BigNumber('0.154'), // 1 LINK = $6.5 USD -> $1 USD = 0.154 LINK
    }
];

export function getPriceUnits(priceDecimal: number, token: PaymentToken): BigNumber {
    return new BigNumber(priceDecimal)
        .times(10 ** tokensInfo.find(t => t.token === token)!.decimals);
}
