const Todo = require('../models/Todo');
const { emitToUser } = require('../socket/socketHandler');

const getTodos = async (req, res) => {
  const todos = await Todo.find({ user: req.user._id })
    .sort({ isCompleted: 1, createdAt: -1 });
  res.json(todos);
};

const createTodo = async (req, res) => {
  const { title, priority, dueDate, linkedEvent } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Task title is required');
  }

  const todo = await Todo.create({
    user: req.user._id,
    title, priority, dueDate, linkedEvent,
  });

  const io = req.app.get('io');
  emitToUser(io, req.user._id, 'todo:created', todo);

  res.status(201).json(todo);
};

const updateTodo = async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });

  if (!todo) {
    res.status(404);
    throw new Error('Todo not found');
  }

  const { title, isCompleted, priority, dueDate, linkedEvent } = req.body;
  if (title !== undefined)        todo.title = title;
  if (isCompleted !== undefined)  todo.isCompleted = isCompleted;
  if (priority !== undefined)     todo.priority = priority;
  if (dueDate !== undefined)      todo.dueDate = dueDate;
  if (linkedEvent !== undefined)  todo.linkedEvent = linkedEvent;

  const updated = await todo.save();

  const io = req.app.get('io');
  emitToUser(io, req.user._id, 'todo:updated', updated);

  res.json(updated);
};

const deleteTodo = async (req, res) => {
  const todo = await Todo.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!todo) {
    res.status(404);
    throw new Error('Todo not found');
  }

  const io = req.app.get('io');
  emitToUser(io, req.user._id, 'todo:deleted', { id: req.params.id });

  res.json({ message: 'Todo deleted', id: req.params.id });
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };