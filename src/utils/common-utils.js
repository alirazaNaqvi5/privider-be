const _ = require("lodash");

const sendErrorResp = (error, req, resp) => {
  console.error(error);
  if (!_.isUndefined(error.response)) {
    const { status } = error.response;
    const { message } = error.response.data;
    resp.status(status).send({ message, status });
  } else {
    if (!_.isUndefined(error.status) && !_.isUndefined(error.message)) {
      return resp.status(error.status).send(error);
    } else if (!_.isUndefined(error.message)) {
      return resp.status(500).send(error.message);
    }
    resp.status(error.status).send({
      message: "Some Internal Server Error Occurred.",
      status: error.status,
      error,
    });
  }
};


const getCurrentDate = () => { return moment().format('YYYY-MM-DD'); }

// create a function to multiply 2 numbers
const multiply = (a, b) => { return a * b; }



/**
 * Utility functions for common operations.
 */

/**
 * Sums two numbers.
 * @param {number} a The first number.
 * @param {number} b The second number.
 * @returns {number} The sum of the two numbers.
 */
function sum(a, b) {
  return a + b;
}

/**
 * Adds two values together.
 * @param {number} x The first value.
 * @param {number} y The second value.
 * @returns {number} The sum of the two values.
 */
function add(x, y) {
  return x + y;
}

module.exports = {
  sum,
  add,
};

module.exports = {
  sendErrorResp,
  getCurrentDate
};