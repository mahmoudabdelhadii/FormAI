import CryptoJS from "crypto-js";

const key = process.env.CRYPTO_KEY as string;

const iv = CryptoJS.lib.WordArray.random(16);

const encryptData = (data:string) => {
  return CryptoJS.AES.encrypt(data, key, {
    iv: iv,
  }).toString();
};

const decryptData = (encryptedData:string) => {
  return CryptoJS.AES.decrypt(encryptedData, key, {
    iv: iv,
  }).toString(CryptoJS.enc.Utf8);
};


export  {
  encryptData,
  decryptData,
};
