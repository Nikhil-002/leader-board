import express from 'express';
import { createConnection } from 'mysql2/promise';

const app = express();
const port = 3000;

// MySQL database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Nikhil@123',
  database: 'Leaderboard',
};

// API to display current week leaderboard (Top 200)
app.get('/leaderboard/current-week', async (req, res) => {
  try {
    const connection = await createConnection(dbConfig);

    // Your SQL query for current week leaderboard (replace with your actual query)
    const query = 'SELECT * FROM UserScores WHERE YEARWEEK(TimeStamp, 1) = YEARWEEK(CURDATE(), 1) ORDER BY Score DESC LIMIT 200';

    const [results] = await connection.execute(query);
    connection.end();

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
    const connection = await createConnection(dbConfig);

    // Your SQL query for last week leaderboard by country (replace with your actual query)
    const query = `SELECT * FROM UserScores WHERE Country = ?  AND YEARWEEK(TimeStamp, 1) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1)ORDER BY Score DESC LIMIT 200;`;

    const [results] = await connection.execute(query, [country]);
    connection.end();

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
    const connection = await createConnection(dbConfig);

    // Your SQL query to fetch user rank by UID (replace with your actual query)
    const query = `SELECT R FROM (SELECT UID, RANK() OVER (ORDER BY Score DESC) AS R FROM UserScores) AS UserRanks WHERE UID = ?;`;

    const [results] = await connection.execute(query, [uid]);
    connection.end();

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
