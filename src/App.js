import React, { useState, useEffect } from 'react';

import './App.css';
import Receipt from './receipt';

const maxTotalExpense = 1000;
const currencyExchangeRate = `https://api.exchangeratesapi.io/latest`;

function App() {
  const [newReceipt, handleNewReceipt] = useState("");
  const [newReceiptAmount, handleNewReceiptAmount] = useState("");
  const [newReceiptCurrency, handleNewReceiptCurrency] = useState("CAD");
  const [preferedCurrency, updatePreferedCurrency] = useState("CAD");

  const [exchangeRateMap, updateExchangeRate] = useState({});
  const [expenses, handleExpenses] = useState([]);

  const handleInputChange = (fn) => (event) => {
    fn(event.target.value);
  }

  useEffect(() => {
    // get available currencies with rates with base.
    fetch(`${currencyExchangeRate}?base=${preferedCurrency}`, {method: "GET"}).then(res => res.json()).then(response => {
      updateExchangeRate(response.rates);
    });
  }, [preferedCurrency]);

  const handleAddReceipt = () => {
    handleExpenses([...expenses, {
      desc: newReceipt,
      amount: newReceiptAmount,
      currency: newReceiptCurrency
    }]);
    handleNewReceipt("");
    handleNewReceiptAmount("");
  }

  const convertToBase = (amount, currency) => amount / exchangeRateMap[currency];

  let totalAmount = 0;

  const submitExpenseReport = () => {
    // Should do exchange rate check before submitting and do final check if it is below 1000.
    expenses.forEach((expense, index) => {
      console.log(`Expense ${index+1}. ${expense.desc}, amount is ${expense.amount} in ${expense.currency} `)
    });
  }
  return (
    <div className="App">
      <header>
        <div>
          Select prefered currency:
          <select className="prefered-currency" value={preferedCurrency} onChange={handleInputChange(updatePreferedCurrency)}>
              {
                Object.keys(exchangeRateMap).map(currency => (
                  <option value={currency} key={currency}>{currency}</option>
                ))
              }
            </select>
        </div>
      </header>
      {
        expenses.length < 5 &&
        <>
          <input type="text" placeholder="Description" className="new-expense" value={newReceipt} onChange={handleInputChange(handleNewReceipt)}/>
          <input type="number" placeholder="Amount" className="new-expense" value={newReceiptAmount} onChange={handleInputChange(handleNewReceiptAmount)}/>
          <select className="new-expense-currency" value={newReceiptCurrency} onChange={handleInputChange(handleNewReceiptCurrency)}>
            {
              Object.keys(exchangeRateMap).map(currency => (
                <option value={currency} key={currency}>{currency}</option>
              ))
            }
          </select>
          <button type="button" onClick={handleAddReceipt}>Add</button>
        </>
      }
      <div>
        <p>Expenses (in {preferedCurrency}):</p>
      {
        expenses.map((expense, index) => {
          const amountInBase = convertToBase(expense.amount, expense.currency)
          totalAmount += amountInBase;
          return <div key={index}>
          <strong>{index+1}.</strong>
          <Receipt  desc={expense.desc} amount={amountInBase}/>
          </div>
        })
      }
      <p>
        <strong>Total: {totalAmount.toFixed(2)}</strong> 
      </p>
      </div>
      <div>
        <button type="button" onClick={submitExpenseReport} disabled={totalAmount > maxTotalExpense || expenses.length == 0}>Submit</button>
        {totalAmount > maxTotalExpense && 
          <p>
          Sorry, you have exceeded the limit for the expese report.
          </p>
        }
      </div>
    </div>
  );
}

export default App;
