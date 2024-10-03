const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ExpenseRouter = require('./Routes/ExpenseRouter'); // Ensure this is imported

require('dotenv').config();
require('./Models/db'); // Ensure your DB is connected
const PORT = process.env.PORT || 8080;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies

app.get('/ping', (req, res) => {
    res.send('PONG');
});

// Route definitions
app.use('/auth', AuthRouter); // Authentication routes
app.use('/expenses', ExpenseRouter); // Expense routes

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
