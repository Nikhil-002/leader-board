import express from 'express';
// import { createConnection } from 'mysql2/promise';
import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config();

const app = express();
const port = 3000;

// MySQL database connection configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const connection = await pool.getConnection();

// API to display current week leaderboard (Top 200)
app.get('/leaderboard/current-week', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const query = 'SELECT * FROM UserScores WHERE YEARWEEK(TimeStamp, 1) = YEARWEEK(CURDATE(), 1) ORDER BY Score DESC LIMIT 200';
    const [results] = await connection.execute(query);
    connection.release();
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API to display last week leaderboard for a given country (Top 200)
app.get('/leaderboard/last-week/:country', async (req, res) => {
  const { country } = req.params;

  try {
    const connection = await pool.getConnection();
    // Your SQL query for last week leaderboard by country (replace with your actual query)
    const query = `SELECT * FROM UserScores WHERE Country = ?  AND YEARWEEK(TimeStamp, 1) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1) ORDER BY Score DESC LIMIT 200;`;

    const [results] = await connection.execute(query, [country]);
    connection.release();

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API to fetch user rank by UID
app.get('/user/:uid/rank', async (req, res) => {
  const { uid } = req.params;

  try {
    const connection = await pool.getConnection();

    // Your SQL query to fetch user rank by UID (replace with your actual query)
    const query = `SELECT R FROM (SELECT UID, RANK() OVER (ORDER BY Score DESC) AS R FROM UserScores) AS UserRanks WHERE UID = ?;`;

    const [results] = await connection.execute(query, [uid]);
    connection.release();

    // res.json(results);

    if (results.length > 0) {
      res.json({ Rank : results[0].R });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get("/", (req,res) =>{
    res.send('<h1>Hello</h1>')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
