import React, { useState } from 'react';
import { handleError } from '../utils';

function ExpenseForm({ addTransaction }) {
    const [expenseInfo, setExpenseInfo] = useState({
        amount: '',
        description: '',
        type: 'expense' // Default type
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const addExpenses = (e) => {
        e.preventDefault();
        const { amount, description } = expenseInfo;
        if (!amount || !description) {
            handleError('Please add Expense Details');
            return;
        }
        addTransaction(expenseInfo);
        setExpenseInfo({ amount: '', description: '', type: 'expense' }); // Reset to default type
    };

    return (
        <div className='container'>
            <h1>Expense Tracker</h1>
            <form onSubmit={addExpenses}>
                <div>
                    <label htmlFor='description'>Description</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='description'
                        placeholder='Enter your description...'
                        value={expenseInfo.description}
                    />
                </div>
                <div>
                    <label htmlFor='amount'>Amount</label>
                    <input
                        onChange={handleChange}
                        type='number'
                        name='amount'
                        placeholder='Enter your Amount...'
                        value={expenseInfo.amount}
                    />
                </div>
                <div>
                    <label htmlFor='type'>Transaction Type</label>
                    <select name='type' value={expenseInfo.type} onChange={handleChange}>
                        <option value='expense'>Expense</option>
                        <option value='income'>Income</option>
                    </select>
                </div>
                <button type='submit'>Add Transaction</button>
            </form>
        </div>
    );
}

export default ExpenseForm;
