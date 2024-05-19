const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const  LoginRouter = require('./Routes/Login.js') 
const  SignInRouter= require('./Routes/SignIn.js')
const  IncomeRouter = require('./Routes/Income.js') 
const  ExpenseRouter= require('./Routes/Expense.js')
const port= process.env.PORT;
app.use(express.json());
app.use(cors({origin:['http://localhost:3000'],
methods:['GET','POST','PUT','DELETE'],
credentials: true}))

app.use('/auth',LoginRouter);
app.use("/auth",SignInRouter);
app.use("/auth",IncomeRouter)
app.use("/auth",ExpenseRouter)


app.post('/verify', (req, res)=> {
    const {token} = req.body;
    console.log(token)
    if(token) {
        jwt.verify(token,process.env.JWT_SECRET_KEY , (err) => {
            if(err) return res.json({Status: false, Error: "Wrong Token"})
            else return res.json({Status:"ok"})
        })
    } else {
        return res.json({Status:"not ok", Error: "Not autheticated"})
    }
} )






app.listen(port,()=>{
    console.log(`Server is listening at port ${port}`)
})