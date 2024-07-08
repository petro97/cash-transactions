const { calculateCashInCommission, calculateNaturalCashOutCommission, calculateLegalCashOutCommission } = require('../src/commissions');
const cashInConfig = {"percents":0.03,"max":{"amount":5,"currency":"EUR"}}
const cashOutNaturalConfig = {"percents":0.3,"week_limit":{"amount":1000,"currency":"EUR"}}
const cashOutJuridicalConfig = {"percents":0.03,"max":{"amount":5,"currency":"EUR"}}

test('Cash in commission', async () => {
    const commission = await calculateCashInCommission(200, cashInConfig);
    expect(commission).toBeCloseTo(0.06, 2);
});

test('Natural cash out commission has not been exceeded in the week', async () => {
    const config = {"percents":0.03,"max":{"amount":5,"currency":"EUR"}}
    const transactions = [
        { "date": "2016-01-06", "user_id": 2, "user_type": "natural", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } },
        { "date": "2016-01-08", "user_id": 2, "user_type": "natural", "type": "cash_out", "operation": { "amount": 700.00, "currency": "EUR" } }
    ]
    const commission = await calculateNaturalCashOutCommission(transactions[1].user_id, transactions[1].operation.amount, transactions[1].date, transactions, cashOutNaturalConfig);
    expect(commission).toBeCloseTo(0, 2);
});

test('Natural cash out commission in the different weeks', async () => {
    const transactions = [
        { "date": "2016-01-06", "user_id": 2, "user_type": "natural", "type": "cash_out", "operation": { "amount": 1300.00, "currency": "EUR" } },
        { "date": "2016-01-11", "user_id": 2, "user_type": "natural", "type": "cash_out", "operation": { "amount": 3000.00, "currency": "EUR" } }
    ]
    const commission = await calculateNaturalCashOutCommission(transactions[1].user_id, transactions[1].operation.amount, transactions[1].date, transactions, cashOutNaturalConfig);
    expect(commission).toBeCloseTo(6, 2);
});

test('The total amount of natural cash withdrawal has been exceeded in the week', async () => {
    const transactions = [
        { "date": "2016-01-06", "user_id": 2, "user_type": "natural", "type": "cash_out", "operation": { "amount": 1300.00, "currency": "EUR" } },
        { "date": "2016-01-10", "user_id": 2, "user_type": "natural", "type": "cash_out", "operation": { "amount": 1000.00, "currency": "EUR" } }
    ]
    const commission = await calculateNaturalCashOutCommission(transactions[1].user_id, transactions[1].operation.amount, transactions[1].date, transactions, cashOutNaturalConfig);
    expect(commission).toBeCloseTo(3, 2);
});

test('Legal cash out commission', async () => {
    const commission = await calculateLegalCashOutCommission(300, cashOutJuridicalConfig);
    expect(commission).toBeCloseTo(0.90, 2);
});