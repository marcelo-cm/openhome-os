import { ApiError } from '@/errors/api-error';

import { TApiErrorResponse, TApiRequestOptions } from './api-client-types';

/**
 * Singleton API client for making HTTP requests with authentication support
 */
class ApiClient {
  private readonly baseUrl: string = '/api';
  private authToken?: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  /**
   * Builds the full URL for the given path
   * @param path - The path to build the URL for
   * @returns The full URL
   */
  getUrl(path: string): string {
    return `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }

  /**
   * Sets the authentication token for subsequent requests
   */
  setToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Clears the authentication token
   */
  clearToken(): void {
    this.authToken = undefined;
  }

  /**
   * Builds headers for the request
   * @param auth - Whether authentication is required
   * @returns Headers object
   * @throws Error if auth is true but no token is set
   */
  private buildHeaders(auth: boolean): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    if (auth) {
      if (!this.authToken) {
        throw new Error('Authentication token is required but not set');
      }
      headers.set('Authorization', `Bearer ${this.authToken}`);
    }

    return headers;
  }

  /**
   * Handles API errors by parsing response and creating appropriate error
   * @param response - Fetch response object
   * @param overrideMessage - Optional message to override backend error
   * @returns Promise that rejects with ApiError
   */
  private async handleApiError(
    response: Response,
    overrideMessage?: string,
  ): Promise<never> {
    let errorResponse: TApiErrorResponse | undefined;

    try {
      // Try to parse error response as JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        errorResponse = await response.json();
      }
    } catch {
      // If parsing fails, we'll use the status text
    }

    throw new ApiError(
      response.status,
      response.statusText,
      errorResponse,
      overrideMessage,
    );
  }

  /**
   * Makes a fetch request and returns parsed JSON
   * @param path - API endpoint path
   * @param options - Request options including auth and error override
   * @returns Parsed JSON response
   * @throws ApiError if response is not OK
   */
  async fetchJson<T = unknown>(
    path: string,
    options: TApiRequestOptions = {},
  ): Promise<T> {
    const { auth = false, overrideErrorMessage, ...fetchOptions } = options;
    const url = this.getUrl(path);
    const headers = this.buildHeaders(auth);

    // Merge custom headers with built headers
    if (fetchOptions.headers) {
      Object.entries(fetchOptions.headers).forEach(([key, value]) => {
        headers.set(key, value as string);
      });
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      await this.handleApiError(response, overrideErrorMessage);
    }

    return response.json();
  }

  /**
   * Makes a fetch request and returns the response body stream
   * @param path - API endpoint path
   * @param options - Request options including auth and error override
   * @returns Response body as ReadableStream
   * @throws ApiError if response is not OK
   */
  async fetchStream(
    path: string,
    options: TApiRequestOptions = {},
  ): Promise<ReadableStream<Uint8Array> | null> {
    const { auth = false, overrideErrorMessage, ...fetchOptions } = options;
    const url = this.getUrl(path);
    const headers = this.buildHeaders(auth);

    // Merge custom headers with built headers
    if (fetchOptions.headers) {
      Object.entries(fetchOptions.headers).forEach(([key, value]) => {
        headers.set(key, value as string);
      });
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      await this.handleApiError(response, overrideErrorMessage);
    }

    return response.body;
  }

  /**
   * Convenience method for GET requests returning JSON
   * @param path - API endpoint path
   * @param options - Request options
   * @returns Parsed JSON response
   */
  async get<T = unknown>(
    path: string,
    options: TApiRequestOptions = {},
  ): Promise<T> {
    return this.fetchJson<T>(path, { ...options, method: 'GET' });
  }

  /**
   * Convenience method for POST requests with JSON body
   * @param path - API endpoint path
   * @param body - Request body to be JSON stringified
   * @param options - Request options
   * @returns Parsed JSON response
   */
  async post<T = unknown>(
    path: string,
    body: unknown,
    options: TApiRequestOptions = {},
  ): Promise<T> {
    return this.fetchJson<T>(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * Convenience method for GET requests returning a stream
   * @param path - API endpoint path
   * @param options - Request options
   * @returns Response body as ReadableStream
   */
  async stream(
    path: string,
    options: TApiRequestOptions = {},
  ): Promise<ReadableStream<Uint8Array> | null> {
    return this.fetchStream(path, { ...options, method: 'GET' });
  }
}

// Create and export singleton instance
export const api = new ApiClient('https://api.example.com');

// Export the class and error types for testing or custom instances
export { ApiClient, ApiError, type TApiErrorResponse, type TApiRequestOptions };
