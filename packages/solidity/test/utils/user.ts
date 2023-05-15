import { User } from "packages/solidity/typechain-types";
import { BACKEND_PV_KEY, UserTestInfo, signMessage } from ".";

// User
export enum Role {
    Employer = 0,
    Contractor = 1,
}

export async function verifyUsers(user: User, ...usersInfo: UserTestInfo[]) {
    const result = [];
    for (let i = 0; i < usersInfo.length; i++) {
        const { pubKey, kycId } = usersInfo[i];
        const signature = await signMessage(BACKEND_PV_KEY, ['address', pubKey], ['string', kycId]);
        await user.verifyUser(pubKey, kycId, signature);
        result.push({ signature });
    }
    return result;
}
