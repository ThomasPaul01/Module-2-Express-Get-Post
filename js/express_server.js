import express from 'express'
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/some-html', (req, res) => {
    res.send('<html><body><h1>bonjour html</h1></body></html>')
})

app.get('/some-json', (req, res) => {
    const data = {"age": 22, "nom" : "Jane"}
    res.json({ data: data })
})

app.get('/transaction', (req, res) => {
    const tableau = [100,2000,3000]
    console.log("headers:", req.headers)
    console.log("body:", req.body)
    res.json({ tableau : tableau })
})

app.get('/exo-query-string', (req, res) => {
    console.log('req.query:', req.query)
    res.send('age: ' + req.query.age)
})

app.get('/get-user/:userId', (req, res) => {
    res.send('userId: ' + req.params.userId)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})