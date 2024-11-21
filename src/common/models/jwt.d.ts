export interface JwtPayload {
  iat: number;
  exp: number;
  type: 'ACCESS' | 'REFRESH';
}
