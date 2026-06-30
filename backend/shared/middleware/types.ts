export interface JwtPayload {
  id:    string;
  email: string;
  name:  string;
  role?: string;
  iat?:  number;
  exp?:  number;
}

export interface AuthenticatedRequest {
  headers: Record<string, string | string[] | undefined>;
  user?:   JwtPayload;
  [key: string]: unknown;
}

export type NextFn = (err?: unknown) => void;

export interface MinimalRequest extends AuthenticatedRequest {}

export interface MinimalResponse {
  status(code: number): MinimalResponse;
  json(body: Record<string, unknown>): MinimalResponse;
}
