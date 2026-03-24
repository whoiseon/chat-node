export interface AccessTokenPayload {
  type: 'access_token';
  userId: string;
}

export interface RefreshTokenPayload {
  type: 'refresh_token';
  userId: string;
  tokenId: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}
