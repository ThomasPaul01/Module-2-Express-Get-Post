const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})