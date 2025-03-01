const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 15);
const nanoid2 = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$(){}[]", 10);
const password = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$(){}[]", 10);

const fiveChar = customAlphabet("123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 5);

const sixDigitOtp = customAlphabet("1234567890", 6);
const paymentNumber = customAlphabet("1234567890", 14);

let genrateUUI = () => {
    return nanoid();
}

let generateUUI2 = () => {
    return nanoid2();
}

let generatePassword = () => {
    return password();
}

let generateFiveChar = () => {
    return fiveChar();
}

let generateOtp = () => {
    return sixDigitOtp();
}
let generatePaymentNumber = () => {
    return paymentNumber();
}
module.exports = { genrateUUI, generateUUI2, generatePassword, generateFiveChar, generateOtp, generatePaymentNumber };

