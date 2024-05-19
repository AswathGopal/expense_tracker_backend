const express = require('express')
const router = express.Router()
const con = require('../Db/db.js')
const jwt = require('jsonwebtoken')
const bcrypt= require('bcrypt')

router.post('/login', (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  

  const sql = "SELECT * FROM user WHERE email = ?";
  con.query(sql, [email], (err, result) => {
    if (err) return res.status(500).json({ "message": "query error occurred" });
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (bcryptErr, bcryptResult) => {
        if (bcryptErr) {
          return res.status(500).json({ "message": "bcrypt error occurred" });
        }
        if (bcryptResult) {
          console.log("Login successful");
          const token = jwt.sign({ email: email}, "jwt_secret_key", { expiresIn: "1d" });
          return res.status(200).json({ "LoginStatus": true, "message": "successfully logged in",token });
        } else {
          console.log("Wrong email or password");
          return res.status(401).json({ "LoginStatus": false, "message": "wrong email or password" });
        }
      });
    } else {
      console.log("User not found");
      return res.status(401).json({ "LoginStatus": false, "message": "User not found" });
    }
  });
});


router.get('/logout',(req,res)=>{
    res.clearCookie('token')
    return res.json({Status:true})
})

module.exports=router;