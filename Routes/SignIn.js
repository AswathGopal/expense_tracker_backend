const express = require('express')
const router = express.Router()
const con = require('../Db/db.js')
const jwt = require('jsonwebtoken')
const bcrypt= require('bcrypt')

router.post("/signup", async (req, res) => {
  const { name, email, password, age, address } = req.body;
  console.log(req.body);
  // Validation
  if (!name || !email || !password || !age || !address) {
    return res.status(200).send({"signupStatus": false, "message": "please fill in all fields"});
  }

  if (name.length > 30) {
    return res.status(200).send({"signupStatus": false, "message": "Name must be within 30 characters"});
  }

  if (password < 0) {
    return res.status(200).send({"signupStatus":false,"message":'Password cannot be negative'});
  }

  if(password.length <0){
    return res.status(200).send({"signupStatus": false, "message": "please fill the password"});
  }

  if (!Number.isInteger(parseInt(age))) {
    return res.status(200).json({"signupStatus": false, "message": "Age must be an integer"});
  }

  const sql = `INSERT INTO user (name,email,password,age,address) VALUES(?,?,?,?,?)`;
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) return res.json({ "signupStatus": false, "message": "hash error occured"});
    console.log(hash.toString());
    con.query(sql, [
      req.body.name,
      req.body.email,
      hash,
      req.body.age,
      req.body.address,
    ], (err, result) => {
      if (err) return res.send({ "signupStatus": false, "message": "query error occured" });
      if (!err) {
        console.log("result", result);
        const token = jwt.sign({
          email: email
        },
          "jwt_secret_key",
          { expiresIn: "1d" }
        );
        res.status(200).json({ "signupStatus": true, "message": "successfully Signed in",token });
      } 
    });
  });
});

module.exports = router;
