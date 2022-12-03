const express = require("express");
const db = require("../db.config/db.config");
const jwt = require("jsonwebtoken");
//const Auth = require("./auth");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const e = require("express");
SECRET = process.env.SECRET;

const register = async (req, res) => {
  const { username, email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  var insertData = `INSERT INTO unhan_modul_17 VALUES (DEFAULT, $1, $2, $3);`;

  await db.query(insertData, [username, email, hashPassword], function (err) {
    if (err) return res.status(500).send(err);
    return res.status(200).send("Data successfully inserted");
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    var getData = await db.query(`SELECT * FROM unhan_modul_17 WHERE email = $1;`, [email]);

    var hash = getData.rows[0]["password"];
    var id = getData.rows[0]["id"];
    var username = getData.rows[0]["username"];

    if ((await bcrypt.compare(password, hash)) == true) {
      let data = {
        userId: id,
        username: username,
        email: email,
        password: hash,
      };

      const token = jwt.sign(data, SECRET);
      res.cookie("JWT", token, { httpOnly: false, sameSite: "strict" }).json({
        id,
        username,
        email,
        token,
      });
    } else {
      res.send("Wrong password");
    }
  } catch (e) {
    console.log(e);
    res.send("Account not found, check your email");
    return;
  }
};

const logout = async (res) => {
  try {
    return res.clearCookie("JWT").send("Logout success");
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(err.message);
  }
};

const verify = async (req, res) => {
  try {
    const { email } = req.body;
    const getData = await db.query(`SELECT * FROM unhan_modul_17 WHERE email = $1;`, [email]);

    var hash = getData.rows[0]["password"];
    var id = getData.rows[0]["id"];
    var username = getData.rows[0]["username"];

    return res.status(200).json({ id, email, username, hash });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  verify,
};
