const roundUp = (num) => Math.ceil(num * 100) / 100;


/**
 * Get the ISO week number of a given date.
 * @param {string} dateStr - The date string (format: 'YYYY-MM-DD').
 * @returns {number} - The ISO week number.
 */
const getWeekNumber = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getUTCDay();
    const diff = date.getUTCDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday being the first day of the week
    const monday = new Date(date.setUTCDate(diff));
    const jan1 = new Date(date.getUTCFullYear(), 0, 1);
    const dayOfYear = ((monday - jan1 + 86400000) / 86400000);
    return Math.ceil(dayOfYear / 7);
};

module.exports = {
    roundUp,
    getWeekNumber
};