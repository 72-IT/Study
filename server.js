const express = require('express');
const bcrypt = require('bcrypt');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ users: [] }).write();

const app = express();
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const user = db.get('users').find({ username }).value();

    if (user) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.get('users').push({ username, password: hashedPassword }).write();
    res.status(200).json({ message: 'User created' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = db.get('users').find({ username }).value();

    if (user && await bcrypt.compare(password, user.password)) {
        if (!req.session) {
            req.session = {};
        }
        req.session.user = user;
        return res.status(200).json({ message: 'Logged in' });
    }

    res.status(401).json({ message: 'Invalid username or password' });
});

app.get('/welcome', (req, res) => {
    if (req.session && req.session.user) {
        return res.status(200).send('Welcome!');
        res.sendFile(__dirname + '/public/welcome.html');
    }

    res.status(401).send('Please log in');
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
});

app.listen(3000, () => console.log('Server started on port 3000'));