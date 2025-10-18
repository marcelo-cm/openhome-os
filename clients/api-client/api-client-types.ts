/**
 * Interface for API error response structure
 */
export type TApiErrorResponse = {
  message?: string;
  error?: string;
  details?: string;
  code?: string;
};

/**
 * Options for API requests
 */
export type TApiRequestOptions = RequestInit & {
  auth?: boolean;
  overrideErrorMessage?: string;
};
