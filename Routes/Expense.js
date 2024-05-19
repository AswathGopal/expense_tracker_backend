const express = require('express');
const con = require('../Db/db.js');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/add-expense',(req, res) => {
    const { title, amount, category, description, date } = req.body.expense;
    const token = req.body.token;
    const email=jwt.decode(token).email;
    console.log(req.body);
    const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');
    try {
        // Validations
        if (!title || !category || !description || !date) {
            return res.status(400).json({ message: 'All fields are required!' });
        }
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number!' });
        }

        // Inserting expense
        const insertQuery = `INSERT INTO expense (title, amount, category, description, date, email) VALUES (?, ?, ?, ?, ?, ?)`;
        con.query(insertQuery, [title, amount, category, description, formattedDate, email], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Query error occured' });
            }
            res.status(200).json({ message: 'Expense Added' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/get-expense', (req, res) => {
    try {
        const selectQuery = `SELECT * FROM expense ORDER BY date DESC`;
        con.query(selectQuery, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Query Error occured' });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.delete('/delete-expense/:id',(req, res) => {
    const { id } = req.params;
    try {
    const token = req.headers.authorization;
    console.log(token);
    const email=jwt.decode(token).email;
        const deleteQuery = `DELETE FROM expense WHERE id = ? AND email= ?`;
        con.query(deleteQuery, [id,email], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Query Error' });
            }
            res.status(200).json({ message: 'Expense Deleted' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports=router;