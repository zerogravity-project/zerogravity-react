/**
 * Common API response types
 * Backend returns standardized responses with success, data, and timestamp
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
  timestamp: string;
}
