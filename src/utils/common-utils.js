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



/**
 * Utility functions for common tasks.
 */

/**
 * Calculates the monthly mortgage payment.
 *
 * @param {number} principal The initial loan amount.
 * @param {number} annualInterestRate The annual interest rate (e.g., 0.05 for 5%).
 * @param {number} loanTermInYears The loan term in years.
 * @returns {number} The monthly mortgage payment.
 */
function calculateMortgage(principal, annualInterestRate, loanTermInYears) {
  const monthlyInterestRate = annualInterestRate / 12;
  const numberOfPayments = loanTermInYears * 12;

  if (monthlyInterestRate === 0) {
    return principal / numberOfPayments; // Handle the case of 0 interest
  }

  const numerator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
  const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
  const monthlyPayment = principal * (numerator / denominator);

  return monthlyPayment;
}


// Example usage (you can remove this later):
const principal = 200000;
const annualInterestRate = 0.06; // 6%
const loanTermInYears = 30;
const monthlyPayment = calculateMortgage(principal, annualInterestRate, loanTermInYears);
console.log(`Monthly mortgage payment: ${monthlyPayment.toFixed(2)}`);


module.exports = {
  calculateMortgage,
};

module.exports = {
  sum,
  add,
};

module.exports = {
  sendErrorResp,
  getCurrentDate
};