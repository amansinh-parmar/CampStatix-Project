// Custom Error class to extend the default JavaScript Error
// Adds a 'status' property for HTTP status codes, along with the error message.

// This class is used to create consistent error objects throughout the app,
// allowing you to throw errors with both a message and an HTTP status code.
// These errors can then be caught and handled by your Express error handling middleware,
// providing clear feedback to the user and proper HTTP responses.

class ExpressError extends Error {
  constructor(message, status) {
    super();           // Call the parent Error constructor
    this.message = message; // Custom error message
    this.status = status;   // HTTP status code (e.g., 404, 500)
  }
}

module.exports = ExpressError;