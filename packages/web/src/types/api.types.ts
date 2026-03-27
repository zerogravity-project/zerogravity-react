/**
 * [Common API response types]
 * Backend returns standardized responses with success, data, and timestamp
 */

export interface ApiResponse<T> {
  /** Request success status */
  success: boolean;
  /** Response payload */
  data: T;
  /** ISO 8601 timestamp */
  timestamp: string;
}

/** API error response structure (matches backend ErrorResponse.java) */
export interface ErrorResponse {
  /** Error code for identification (e.g., "DAILY_ALREADY_EXISTS") */
  error: string;
  /** Human-readable error message */
  message: string;
  /** ISO 8601 timestamp */
  timestamp: string;
}
