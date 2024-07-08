const fs = require('fs');
const path = require('path');
require('dotenv').config()
const { getCashInCommission, getNaturalCashOutCommission, getLegalCashOutCommission } = require('./commissions');


const processOperations = async (operations) => {
    for (const operation of operations) {
        const { type, user_type, operation: { amount }, user_id, date } = operation;
        let commission = 0;
        if (type === 'cash_in') {
            commission = await getCashInCommission(amount);
        } else if (type === 'cash_out') {
            if (user_type === 'natural') {
                commission = await getNaturalCashOutCommission(user_id, amount, date, operations);
            } else {
                commission = await getLegalCashOutCommission(amount);
            }
        }
        console.log(commission.toFixed(2));
    }
};

const main = async () => {
    const filePath = process.argv[2];
    if (!filePath) {
        console.error('Please provide a path to the input file.');
        process.exit(1);
    }

    const data = fs.readFileSync(path.resolve(filePath), 'utf-8');
    const operations = JSON.parse(data);

    await processOperations(operations);
};

main();