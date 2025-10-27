import { TApiErrorResponse } from '@/clients/api-client/api-client-types';

/**
 * Custom API error class that preserves backend error messages
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly response?: TApiErrorResponse;
  public readonly isOverridden: boolean;

  constructor(
    status: number,
    statusText: string,
    response?: TApiErrorResponse,
    overrideMessage?: string,
  ) {
    const message =
      overrideMessage ||
      response?.message ||
      response?.error ||
      response?.details ||
      `HTTP error! status: ${status}`;

    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.response = response;
    this.isOverridden = !!overrideMessage;
  }
}
