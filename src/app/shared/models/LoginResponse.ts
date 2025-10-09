
export interface UserDto {
  id: number;
  username: string;
  email: string;
  name?: string;
  lastName?: string;
  company?: { id: number; name?: string } | null;
  roles?: string[];
}

export interface JwtResponse {
  accessToken: string;
  tokenType?: string;
  refreshToken?: string;
  user?: UserDto;
}
