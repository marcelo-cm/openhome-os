import { ApiError, api } from '../api-client';

// Set authentication token
api.setToken('your-auth-token-here');

/**
 * Example 1: Handling trusted backend errors (surfaces backend error messages)
 */
async function handleTrustedBackendError() {
  try {
    const user = await api.get('/users/invalid-id', { auth: true });
    console.log('User:', user);
  } catch (error) {
    if (error instanceof ApiError) {
      // Backend error message is safe to display to user
      console.error('User-facing error:', error.message);
      console.error('Status:', error.status);
      console.error('Full response:', error.response);

      // You can show this message directly to the user
      alert(`Error: ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

/**
 * Example 2: Handling untrusted third-party API errors (overrides error messages)
 */
async function handleUntrustedThirdPartyError() {
  try {
    const data = await api.get('/third-party/data', {
      auth: true,
      overrideErrorMessage:
        'Unable to fetch external data. Please try again later.',
    });
    console.log('Third-party data:', data);
  } catch (error) {
    if (error instanceof ApiError) {
      // This will be our safe override message, not the third-party error
      console.error('Safe error message:', error.message);
      console.error('Was overridden:', error.isOverridden); // true
      console.error('Original response:', error.response); // Still available for logging

      // Safe to show to user
      alert(`Error: ${error.message}`);
    }
  }
}

/**
 * Example 3: POST request with error handling
 */
async function createUserWithErrorHandling() {
  try {
    const newUser = await api.post(
      '/users',
      {
        name: '', // Invalid - empty name
        email: 'invalid-email', // Invalid email format
      },
      { auth: true },
    );

    console.log('Created user:', newUser);
  } catch (error) {
    if (error instanceof ApiError) {
      // Backend validation errors are safe to show
      console.error('Validation error:', error.message);

      // Handle specific error codes
      if (error.status === 400) {
        console.error('Bad request - validation failed');
      } else if (error.status === 401) {
        console.error('Unauthorized - token may be expired');
        // Redirect to login
      }
    }
  }
}

/**
 * Example 4: Generic error handler for UI components
 */
function handleApiError(
  error: unknown,
  fallbackMessage = 'An unexpected error occurred',
) {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      status: error.status,
      isOverridden: error.isOverridden,
      canRetry: error.status >= 500, // Server errors might be retryable
    };
  }

  return {
    message: fallbackMessage,
    status: 0,
    isOverridden: false,
    canRetry: false,
  };
}

/**
 * Example 5: React component error handling pattern
 */
interface IUser {
  id: string;
  name: string;
  email: string;
}

async function fetchUserProfile(userId: string): Promise<IUser | null> {
  try {
    return await api.get<IUser>(`/users/${userId}`, { auth: true });
  } catch (error) {
    const errorInfo = handleApiError(error);

    // Log for debugging (includes original error if available)
    console.error('Failed to fetch user profile:', {
      userId,
      error: error instanceof ApiError ? error.response : error,
      userMessage: errorInfo.message,
    });

    // Show user-friendly message
    if (errorInfo.status === 404) {
      throw new Error('User not found');
    } else if (errorInfo.status === 403) {
      throw new Error('You do not have permission to view this user');
    } else {
      throw new Error(errorInfo.message);
    }
  }
}

/**
 * Example 6: Batch operations with individual error handling
 */
async function batchUpdateUsers(users: Array<{ id: string; name: string }>) {
  const results = await Promise.allSettled(
    users.map(async (user) => {
      try {
        return await api.post(`/users/${user.id}`, user, { auth: true });
      } catch (error) {
        if (error instanceof ApiError) {
          return {
            error: true,
            id: user.id,
            message: error.message,
            status: error.status,
          };
        }
        throw error;
      }
    }),
  );

  const successful = results
    .filter(
      (result): result is PromiseFulfilledResult<unknown> =>
        result.status === 'fulfilled',
    )
    .map((result) => result.value);

  const failed = results
    .filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected',
    )
    .map((result) => result.reason);

  console.log(`Updated ${successful.length} users successfully`);
  console.log(`Failed to update ${failed.length} users`);

  return { successful, failed };
}

/**
 * Example 7: Handling different error response formats
 */
async function handleVariousErrorFormats() {
  const testCases = [
    { path: '/error-with-message', description: 'Backend with message field' },
    {
      path: '/error-with-error-field',
      description: 'Backend with error field',
    },
    { path: '/error-with-details', description: 'Backend with details field' },
    {
      path: '/third-party-untrusted',
      description: 'Untrusted third-party API',
    },
  ];

  for (const testCase of testCases) {
    try {
      await api.get(testCase.path, {
        auth: true,
        overrideErrorMessage: testCase.path.includes('third-party')
          ? 'External service temporarily unavailable'
          : undefined,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        console.log(`${testCase.description}:`, {
          message: error.message,
          isOverridden: error.isOverridden,
          originalResponse: error.response,
        });
      }
    }
  }
}

// Export all examples
export {
  handleTrustedBackendError,
  handleUntrustedThirdPartyError,
  createUserWithErrorHandling,
  handleApiError,
  fetchUserProfile,
  batchUpdateUsers,
  handleVariousErrorFormats,
};
