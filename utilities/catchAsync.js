// This utility function helps handle errors in async functions/middleware for Express routes.
// It takes an async function (func) and returns a new function that calls the original async function,
// but catches any errors and passes them to the Express error handler via next().
// This avoids repetitive try-catch blocks in every async route handler.

module.exports = (func) => {
  return (req, res, next) => {
    // Call the async function and catch any errors
    func(req, res, next).catch(next); // If error occurs, pass it to next()
  };
};