// const jwtDecode = require('jwt-decode');
const express = require("express");
const con = require('../Db/db.js');
const jwt = require('jsonwebtoken');
const router = express.Router();


router.post('/add-income',(req, res) => {
    console.log(req.body);
    const { title, amount, category, description, date } = req.body.income;
    const token = req.body.token;
    const email=jwt.decode(token).email;
    const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');
    try {
        // Validations
        if (!title || !category || !description || !date) {
            return res.status(400).json({ message: 'All fields are required!' });
        }
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number!' });
        }

        // Inserting income
        const insertQuery = `INSERT INTO income (title, amount, category, description, date,email) VALUES (?, ?, ?, ?, ?, ?)`;
        con.query(insertQuery, [title, parseInt(amount), category, description, formattedDate,email], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Server Error' });
            }
            res.status(200).json({ message: 'Income Added' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/get-income',(req, res) => {
    try {
        const selectQuery = `SELECT * FROM income ORDER BY date DESC`;
        con.query(selectQuery, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Server Error' });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.delete('/delete-income/:id' ,(req, res) => {
    const { id } = req.params;
    try {
    const token = req.headers.authorization;
    console.log(token);
    const email=jwt.decode(token).email;
        const deleteQuery = `DELETE FROM income WHERE id = ? AND email= ? `;
        con.query(deleteQuery, [id,email], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Server Error' });
            }
            res.status(200).json({ message: 'Income Deleted' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports=router;