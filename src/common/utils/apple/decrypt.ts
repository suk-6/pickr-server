import * as jwt from "jsonwebtoken";
import { JwksClient } from "jwks-rsa";

interface AppleJwtTokenPayload {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  nonce: string;
  c_hash: string;
  email?: string;
  email_verified?: string;
  is_private_email?: string;
  auth_time: number;
  nonce_supported: boolean;
}

const appleOAuthDecrypt = async (idToken: string) => {
  const decodedToken = jwt.decode(idToken, { complete: true }) as {
    header: { kid: string; alg: jwt.Algorithm };
    payload: { sub: string };
  };

  const keyIdFromToken = decodedToken.header.kid;

  const applePublicKeyUrl = "https://appleid.apple.com/auth/keys";

  const jwksClient = new JwksClient({ jwksUri: applePublicKeyUrl });

  const key = await jwksClient.getSigningKey(keyIdFromToken);
  const publicKey = key.getPublicKey();

  const verifiedDecodedToken: AppleJwtTokenPayload = jwt.verify(
    idToken,
    publicKey,
    {
      algorithms: [decodedToken.header.alg],
    },
  ) as AppleJwtTokenPayload;

  return verifiedDecodedToken;
};

export default appleOAuthDecrypt;
