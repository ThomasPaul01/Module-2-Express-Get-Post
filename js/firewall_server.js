import express from 'express';
import { headerLogger, firewall } from './middleware.js';
import { checkCredentials, authenticatedUsers, newUserRegistered } from './inMemoryUserRepository.js';
import { randomUUID } from 'crypto';

const app = express();
const port = 3001;

app.use(express.json());

// Attach header logger globally
app.use(headerLogger);

// Attach firewall middleware globally (it will allow whitelist paths)
app.use(firewall);

// Public route
app.get('/hello', (req, res) => {
  res.send('<h1>hello</h1>');
});

// Restricted routes
app.get('/restricted1', (req, res) => {
  res.json({ message: 'topsecret' });
});

app.get('/restricted2', (req, res) => {
  res.send('<h1>Admin space</h1>');
});

app.post('/authenticate', (req, res) => {
  // Be defensive: req.body may be undefined if the client sent credentials in headers
  let login = undefined;
  let password = undefined;

  if (req.body && Object.keys(req.body).length > 0) {
    login = req.body.login;
    password = req.body.password;
  } else {
    // Fallback to headers (some clients send credentials as headers)
    login = req.headers['login'];
    password = req.headers['password'];
  }

  console.log(`Authentication attempt for login: ${login}`);
  if (!login || !password) {
    return res.status(400).json({ error: 'missing credentials' });
  }

  if (checkCredentials(login, password)) {
    // generate a random UUID token for this session
    const token = randomUUID();
    console.log(`Authenticated ${login}, generated token: ${token}`);
    authenticatedUsers[token] = { email: `${login}@example.com` };

    console.log('Current authenticated users:', authenticatedUsers);
    return res.json({ token });
  }
  return res.status(403).json({ error: 'forbidden' });
});

// Registration endpoint: add a new user (password stored in plain text for now)
app.post('/register', (req, res) => {
    let login = undefined;
    let password = undefined;

    if (req.body && Object.keys(req.body).length > 0) {
        login = req.body.login;
        password = req.body.password;
    } else {
        // Fallback to headers (some clients send credentials as headers)
        login = req.headers['login'];
        password = req.headers['password'];
    }
  
  if (!login || !password) return res.status(400).json({ error: 'missing credentials' });

  const added = newUserRegistered(login, password);
  if (!added) return res.status(409).json({ error: 'user already exists' });

  return res.status(201).json({ message: 'user registered' });
});

app.listen(port, () => {
  console.log(`Firewall example server listening on http://localhost:${port}`);
});

