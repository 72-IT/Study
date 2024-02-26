const express = require('express');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ users: [] }).write();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/login.html'));
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const userExists = db.get('users').find({ username }).value();
  if (userExists) {
    return res.status(400).send('Username already exists');
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  db.get('users').push({ username, password: hashedPassword }).write();
  res.status(200).send('User created');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.get('users').find({ username }).value();
  if (user && await bcrypt.compare(password, user.password)) {
    res.status(200).send('Logged in');
  } else {
    res.status(401).send('Invalid username or password');
  }
});

app.listen(3000, () => console.log('Server started on port 3000'));