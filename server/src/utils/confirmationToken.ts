import {createHash} from "crypto";

const generateConfirmationToken = (userId:string) => {
  const currentTime = Date.now().toString();
  const tokenData = `${currentTime}${userId}`;
  return createHash("sha256").update(tokenData).digest("hex");
};

export default generateConfirmationToken;
