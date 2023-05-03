import { expect } from "chai";

export async function expectThrowsAsync(asyncFunc: () => Promise<any>, errorMessage: string) {
    let error = null;
    try {
        await asyncFunc();
    }
    catch (err: any) {
        error = err;
    }
    expect(error).to.be.an('Error')
    if (errorMessage) {
        expect(error.message).to.include(errorMessage);
    }
}
