const { v4: uuidv4 } = require("uuid");
const fs = require("fs/promises");
const readTodo = async () => {
  const data = await fs.readFile("todolist.json", "utf-8");
  return JSON.parse(data);
};
const saveTodo = (data) => fs.writeFile("todolist.json", JSON.stringify(data)); //return เป็น promise เสมอ เลยไม่ต้องใส่ async/ await

const createTodo = async (req, res, next) => {
  try {
    const { title, completed, dueDate } = req.body;

    if (typeof title !== "string") {
      res.status(400).json({ message: "title must be string" });
    } else if (title.trim() === "") {
      res.status(400).json({ message: "title is required" });
    } else if (
      typeof completed !== undefined &&
      typeof completed !== "boolean"
    ) {
      res.status(400).json({ message: "completed must be a boolean" });
    } else if (isNaN(new Date(dueDate).getTime())) {
      res.status(400).json({ message: "dueDate invalid format" });
    } else {
      const newTodo = {
        title,
        id: uuidv4(),
        completed: completed ?? false,
        dueDate: dueDate ? new Date(dueDate) : null,
      };
      const oldTodos = await readTodo(); // เรียกใช้ fn. readTodo ที่ทไไว้ข้่างบน
      oldTodos.push(newTodo);
      await saveTodo(oldTodos);
      res.status(201).json({ todo: newTodo });
    }
  } catch (err) {
    next(err);
  }
};

const getTodo = async (req, res, next) => {
  try {
    const todos = await readTodo();
    res.json({ todos });
  } catch (err) {
    next(err);
  }
};

const getTodoID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todos = await readTodo();
    const todo = todos.find((item) => item.id === id);
    res.json({ todo: todo ?? null }); // todo: todo || null
  } catch (err) {
    next(err);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const { title, completed, dueDate } = req.body;

    if (typeof title !== "string") {
      res.status(400).json({ message: "title must be string" });
    } else if (title.trim() === "") {
      res.status(400).json({ message: "title is required" });
    } else if (
      typeof completed !== undefined &&
      typeof completed !== "boolean"
    ) {
      res.status(400).json({ message: "completed must be a boolean" });
    } else if (isNaN(new Date(dueDate).getTime())) {
      res.status(400).json({ message: "dueDate invalid format" });
    }
    const todos = await readTodo();
    const idx = todos.findIndex((item) => item.id === id);

    if (idx === -1) {
      return res.status(400).json({ message: " todo with this id not found" });
    }

    todos[idx] = {
      ...todo[idx],
      title,
      completed: completed ?? todo[idx].completed,
      dueDate: dueDate ? new Date(dueDate) : todos[idx].dueDate,
    };

    await saveTodo(todos);
    res.json({ todo: todos[idx] });
  } catch (err) {
    next(err);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todos = await readTodo();
    const idx = todos.findIndex((item) => item.id === id);
    if (idx === -1) {
      return res.status(400).json({ message: "todo with this id not found" });
    }
    todos.splice(idx, 1);
    await saveTodo(todos);
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

module.exports = { createTodo, getTodo, getTodoID, updateTodo, deleteTodo };
