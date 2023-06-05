import PriceControllerABI from '../abi/PriceController.json';
import { useCallback, useEffect, useState } from 'react';
import { BigNumber, utils } from 'ethers'
import { useContractRead } from 'wagmi'

export const usePriceFeed = (amountCurrency: string, globalAmount: string) => {
    const [cryptoPrice, setCryptoPrice] = useState<string>()
    const [bigNumberPrice, setBigNumberPrice] = useState<BigNumber>()
    const idForToken: Record<string,number | null> = {
        'avax': 0,
        'usdt': null
    };

    const { data, isError, isLoading } = useContractRead({
        address: process.env.NEXT_PUBLIC_PRICE_FEED as `0x${string}` ?? "",
        abi: PriceControllerABI.abi,
        functionName: 'getTokenPriceFromUsd',
        args: [idForToken[amountCurrency] ?? 0, parseInt(globalAmount) ?? 0],
      })

    
    useEffect(() => {
        if (globalAmount === '0') {
            setCryptoPrice(undefined);
            setBigNumberPrice(undefined);
        } else {
            if (data && !isError) {
                if (data.toNumber() > 0) {
                    console.log(utils.formatUnits(data.toString(), BigNumber.from(18)).toString());
                    setCryptoPrice(utils.formatUnits(data.toString(), BigNumber.from(18)).toString());
                    setBigNumberPrice(data);
                }
            }
        }
    }, [data, isError])

    return {cryptoPrice, bigNumberPrice}
};