import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import ExpenseTable from './ExpenseTable';
import ExpenseForm from './ExpenseForm';
import ExpenseDetails from './ExpenseDetails'; // Assuming you have an ExpenseDetails component

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [incomeAmt, setIncomeAmt] = useState(0);
    const [expenseAmt, setExpenseAmt] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('loggedInUser');
        if (!user) {
            navigate('/login'); // Redirect if no user is logged in
        }
        setLoggedInUser(user);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    // Calculate income and expense amounts
    useEffect(() => {
        const amounts = expenses.map(item => item.amount);
        const income = amounts.filter(item => item > 0) // Positive amounts for income
            .reduce((acc, item) => acc + item, 0);
        const exp = amounts.filter(item => item < 0) // Negative amounts for expenses
            .reduce((acc, item) => acc + Math.abs(item), 0); // Use Math.abs to get the positive value

        setIncomeAmt(income);
        setExpenseAmt(exp);
    }, [expenses]);

    const deleteExpens = async (id) => {
        try {
            const url = `${APIUrl}/expenses/${id}`;
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    'Authorization': localStorage.getItem('token'),
                }
            });

            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            handleSuccess(result?.message);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    };

    const fetchExpenses = async () => {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage

        const response = await fetch('http://localhost:8080/expenses', {
            method: 'GET',
            headers: {
                'Authorization': token, // Include the token in the Authorization header
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            setExpenses(data.data); // Ensure the data structure is correct
        } else {
            console.error('Error fetching expenses:', response.status);
        }
    };

    const addTransaction = async (data) => {
        try {
            const url = `${APIUrl}/expenses`;
            // Ensure the amount is positive for income and negative for expenses
            const transaction = {
                description: data.description,
                amount: data.type === 'income' ? Math.abs(data.amount) : -Math.abs(data.amount), // Correct sign based on type
            };
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transaction),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const result = await response.json();
            handleSuccess(result?.message);
            setExpenses(result.data); // Assuming result.data is the updated list of expenses
        } catch (err) {
            handleError(err);
        }
    };
    
    useEffect(() => {
        fetchExpenses();
    }, []); // Removed fetchExpenses from dependencies, as it doesn't need to change

    return (
        <div>
            <div className='user-section'>
                <h1>Welcome {loggedInUser}</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <ExpenseDetails incomeAmt={incomeAmt} expenseAmt={expenseAmt} />
            <ExpenseForm addTransaction={addTransaction} />
            <ExpenseTable expenses={expenses} deleteExpens={deleteExpens} />
            <ToastContainer />
        </div>
    );
}

export default Home;
