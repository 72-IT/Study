const express = require('express');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const adapter = new FileSync('db.json');
const db = low(adapter);

// Set some defaults if your JSON file is empty
db.defaults({ users: [] }).write();

const app = express();

app.use(express.json());

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  // Check if username already exists
  const userExists = db.get('users').find({ username }).value();
  if (userExists) {
    return res.status(400).send('Username already exists');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Store the user in the database
  db.get('users').push({ username, password: hashedPassword }).write();

  res.status(200).send('User created');
});

app.listen(3000, () => console.log('Server started on port 3000'));