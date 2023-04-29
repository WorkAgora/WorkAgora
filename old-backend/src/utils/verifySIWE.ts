import {recoverTypedSignature, SignTypedDataVersion, TypedDataV1} from "@metamask/eth-sig-util";

/**
 * Verifies the signature of the SIWE message, returning the wallet address if valid, or null if invalid.
 * @param walletSignature
 * @param walletAddress
 * @returns {string | null}
 */
export const verifySIWE = (walletSignature: string, walletAddress: string): string | null => {
    const messageTypedData: TypedDataV1 = [
        {name: 'userAddress', type: 'string', value: walletAddress},
    ];

    try {
        const recoveredAddress = recoverTypedSignature({
            version: SignTypedDataVersion.V1,
            data: messageTypedData,
            signature: walletSignature
        });
        return recoveredAddress.toLowerCase() === walletAddress.toLowerCase() ? recoveredAddress : null;
    } catch (error) {
        console.error("Error recovering signature: ", error);
        return null;
    }
};
