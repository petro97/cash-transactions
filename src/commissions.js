const axios = require('axios');
const { roundUp, getWeekNumber } = require('./utils');
const API_HOST = process.env.API_HOST
/**
 * Get cash in commission.
 * @param {number} amount - amount.
 * @returns {number} - commission.
 */
const getCashInCommission = async (amount) => {
    const response = await axios.get(`${API_HOST}/tasks/api/cash-in`);
    const config = response.data;
    return calculateCashInCommission(amount, config)
};

const calculateCashInCommission = async (amount, config) => {
    const commission = roundUp(amount * (config.percents / 100));
    return commission > config.max.amount ? config.max.amount : commission;
};

/**
 * Get natural cash out commission.
 * @param {number} userId - User ID.
 * @param {number} amount - Amount.
 * @param {string} date - The date string (format: 'YYYY-MM-DD').
 * @param {array} transactions - array of transactions.
 * @returns {number} - commission.
 */
const getNaturalCashOutCommission = async (userId, amount, date, transactions) => {
    const response = await axios.get(`${API_HOST}/tasks/api/cash-out-natural`)
    const config = response.data
    return calculateNaturalCashOutCommission(userId, amount, date, transactions, config)
}

const calculateNaturalCashOutCommission = async (userId, amount, date, transactions, config) => {
    const weekNumber = getWeekNumber(date);
    const transactionDate = new Date(date);

    const weeklyTransactions = transactions
        .filter(txn => txn.user_id === userId && getWeekNumber(txn.date) === weekNumber && txn.type === 'cash_out')
        .filter(txn => new Date(txn.date) < transactionDate);

    let weeklyTotal = 0;
    let chargeableAmount = 0;
    const freeLimit = config.week_limit.amount;

    for (let txn of weeklyTransactions) {
        weeklyTotal += txn.operation.amount;
    }

// Check if the current transaction pushes the total over the limit
    if (weeklyTotal + amount > freeLimit) {
        if (weeklyTotal < freeLimit) {
            chargeableAmount = weeklyTotal + amount - freeLimit;
        } else {
            chargeableAmount = amount;
        }
    }
    return roundUp(chargeableAmount * (config.percents / 100));
}

/**
 * Get legal cash out commission.
 * @param {number} amount - The date string (format: 'YYYY-MM-DD').
 * @returns {number} - commission.
 */
const getLegalCashOutCommission = async (amount) => {
    const response = await axios.get(`${API_HOST}/tasks/api/cash-out-juridical`);
    const config = response.data;
    return calculateLegalCashOutCommission(amount, config)
};
const calculateLegalCashOutCommission = async (amount, config) => {
    const commission = roundUp(amount * 0.003);
    return commission < config.min ? config.min : commission;
}




module.exports = {
    getCashInCommission,
    getNaturalCashOutCommission,
    getLegalCashOutCommission,
    calculateCashInCommission,
    calculateNaturalCashOutCommission,
    calculateLegalCashOutCommission
};