// app.js or app.mjs
import express from 'express';
// import mongoose from './db';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, this is your Express application!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
