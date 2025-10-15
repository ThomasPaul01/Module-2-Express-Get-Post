import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
import router from './route.js';

const app = express()
const port = 3000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//app.use('/', router);

// Logger that runs BEFORE express.json()
function loggerBefore(request, response, next) {
  console.log(`BEFORE JSON parse -> ${request.method} ${request.url} body:`, request.body);
  next();
}

// Logger that runs AFTER express.json()
function loggerAfter(request, response, next) {
  console.log(`AFTER JSON parse  -> ${request.method} ${request.url} body:`, request.body);
  next();
}

// Register loggerBefore, then JSON parser, then loggerAfter
app.use(loggerBefore);
app.use(express.json());
app.use(loggerAfter);

// Serve static files from the 'template' directory (index.html will be served at GET /)
app.use(express.static(path.join(__dirname, 'templates')));

// Serve public assets (CSS, JS, images) under /public
app.use('/public', express.static(path.join(__dirname, 'public')));

let currentId = 1
const tasks = []

app.post('/data', (req, res) => {
    console.log("req.body:", req.body)
  res.json({ 'req.body': req.body })
})

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/new-task", (req, res) => {
  const { title, description, isDone } = req.body;

  const newTask = {
    id: currentId++,
    title,
    description,
    isDone: isDone ?? false,
  };

  tasks.push(newTask);
});

app.put("/update-task/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, isDone } = req.body;

  const task = tasks.find((t) => t.id === id);

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (isDone !== undefined) task.isDone = isDone;

  res.json({ message: "Tâche mise à jour", task });
});

app.delete("/delete-task/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  const deleted = tasks.splice(index, 1);
  res.json({ message: "Tâche supprimée", deletedTask: deleted[0] });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

function loggerMiddleware(request, response, next) {
  console.log(`${request.method} ${request.url}`);
  next();
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})