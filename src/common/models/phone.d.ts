import { User } from '@prisma/client';

export interface JwtPhonePayload extends Pick<User, 'id'> {
  phone: string;
  iat: number;
  exp: number;
}
