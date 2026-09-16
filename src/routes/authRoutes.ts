import express from "express";
import pool from "../config/database";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/signup', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const existingUser = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  if(existingUser.rows.length > 0){
    return res.json({
      message: "User already exists"
    });
  }

  const response = await pool.query("INSERT INTO users (username, password) VALUEs ($1, $2) RETURNING id",
    [username, password]);
  
  res.json({
    id: response.rows[0].id,
    message: 'signup successful'
  });
});

router.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const response = await pool.query("SELECT * FROM users WHERE username = $1 AND password = $2", [username, password]);
  const user = response.rows[0];
  if(!user){
    return res.status(403).json({
      message: "Invalid credentials"
    });
  }

  if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not defined");
  }
  const token = jwt.sign({
    userId: user.id,
    username: user.username
  }, JWT_SECRET);

  res.json({
    message: "Login successful",
    token
  });
});

export default router;