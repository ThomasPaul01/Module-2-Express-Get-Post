import express from 'express'
const app = express()
const port = 3000

// Simple route returning HTML
app.get('/hello', (req, res) => {
  res.send('<h1>hello</h1>');
});

// Restricted route returning JSON if token present and correct
app.get('/restricted1', requireToken, (req, res) => {
  res.json({ message: 'topsecret' });
});

// Restricted route returning HTML if token present and correct
app.get('/restricted2', requireTokenHtml, (req, res) => {
  res.send('<h1>Admin space</h1>');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function requireToken(req, res, next) {
  const token = req.headers['token'] || req.headers['Token'] || req.headers['TOKEN'];
  if (token === undefined) {
    return res.status(403).json({ error: 'forbidden' });
  }
  if (String(token) !== '42') {
    return res.status(403).json({ error: 'forbidden' });
  }
  next();
}

function requireTokenHtml(req, res, next) {
  const token = req.headers['token'] || req.headers['Token'] || req.headers['TOKEN'];
  if (token === undefined || String(token) !== '42') {
    return res.status(403).send('<h1>Forbidden</h1>');
  }
  next();
}

