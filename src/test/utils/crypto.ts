import * as Chai from "chai";
import * as Crypto from "../../utils/crypto";

describe("Crypto.desDecrypt()", () => {
    let text = "U2FsdGVkX1/BN3Itlv5RarqKu5pealPWkrawc75xp8zVisoozucopnNdkb6gogQl4icLaiDbpTrxRL2MIu9FWv0aAvbvJSjS";
    let key = "5000000000000000";
    it(" success:", async () => {
        let result: any = await Crypto.desDecrypt(text, key);
        return;
    });
});