import crypto from 'crypto-js';
const password = 'mkHj23';

type CookieValue = {
    id: number,
    name: string,
}


export function encryptCookie(cookieJson: CookieValue) {
    const cookieString = JSON.stringify(cookieJson);
    const result = crypto.AES.encrypt(cookieString, password);

    return result.toString();
}

export function decryptCookie(text: string) {
    const result = crypto.AES.decrypt(text, password);
    const data = JSON.parse(result.toString(crypto.enc.Utf8));
    return data as CookieValue;
}
