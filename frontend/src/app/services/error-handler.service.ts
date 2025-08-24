import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

export interface ErrorHandlerOptions {
  duration?: number;
  showSuccessMessage?: boolean;
  successMessage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private snackBar = inject(MatSnackBar);

  /**
   * Handle HTTP errors and display appropriate messages
   */
  handleError(error: any, options: ErrorHandlerOptions = {}): void {
    const { duration = 5000 } = options;
    
    let errorMessage = this.extractErrorMessage(error);
    
    this.snackBar.open(errorMessage, 'Close', {
      duration,
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Show success message
   */
  showSuccess(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Show warning message
   */
  showWarning(message: string, duration: number = 4000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['warning-snackbar']
    });
  }

  /**
   * Extract meaningful error message from HTTP error response
   */
  private extractErrorMessage(error: any): string {
    // Default error message
    let errorMessage = 'An unexpected error occurred. Please try again.';
    
    if (error?.error?.message) {
      if (typeof error.error.message === 'string') {
        errorMessage = error.error.message;
      } else if (Array.isArray(error.error.message)) {
        // Handle validation errors array
        errorMessage = 'Please fix the following: ' + error.error.message.join(', ');
      }
    } else if (error?.message) {
      errorMessage = error.message;
    }

    // Handle specific HTTP status codes
    switch (error?.status) {
      case 400:
        if (!error?.error?.message) {
          errorMessage = 'Invalid request. Please check your input and try again.';
        }
        break;
      
      case 401:
        errorMessage = 'Invalid credentials. Please check your email and password.';
        break;
      
      case 403:
        errorMessage = 'You do not have permission to perform this action.';
        break;
      
      case 404:
        errorMessage = 'The requested resource was not found.';
        break;
      
      case 409:
        if (!error?.error?.message) {
          errorMessage = 'A conflict occurred. The resource may already exist.';
        }
        break;
      
      case 422:
        errorMessage = 'The provided data is invalid. Please check your input.';
        break;
      
      case 429:
        errorMessage = 'Too many requests. Please wait a moment and try again.';
        break;
      
      case 500:
        errorMessage = 'Server error. Please try again later.';
        break;
      
      case 502:
      case 503:
      case 504:
        errorMessage = 'Service temporarily unavailable. Please try again later.';
        break;
      
      case 0:
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
        break;
    }

    return errorMessage;
  }

  /**
   * Handle authentication-specific errors
   */
  handleAuthError(error: any): void {
    let errorMessage = this.extractErrorMessage(error);

    // Override with more specific auth messages
    if (error?.status === 401) {
      errorMessage = 'Invalid email or password. Please check your credentials.';
    } else if (error?.status === 409) {
      errorMessage = 'An account with this email already exists. Please try logging in instead.';
    }

    this.snackBar.open(errorMessage, 'Close', {
      duration: 6000,
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Handle validation errors specifically
   */
  handleValidationError(error: any): void {
    let errorMessage = 'Please correct the following errors:';
    
    if (error?.error?.message && Array.isArray(error.error.message)) {
      errorMessage = error.error.message.join(', ');
    } else if (error?.error?.message) {
      errorMessage = error.error.message;
    }

    this.snackBar.open(errorMessage, 'Close', {
      duration: 7000,
      panelClass: ['error-snackbar']
    });
  }
}