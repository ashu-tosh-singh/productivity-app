const Note = require('../models/Note');
const { emitToUser } = require('../socket/socketHandler');

const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user._id })
    .sort({ isPinned: -1, updatedAt: -1 });
  res.json(notes);
};

const createNote = async (req, res) => {
  const { title, content, tags, color, isPinned } = req.body;

  const note = await Note.create({
    user: req.user._id,
    title, content, tags, color, isPinned,
  });

  // Broadcast to all tabs of this user
  const io = req.app.get('io');
  emitToUser(io, req.user._id, 'note:created', note);

  res.status(201).json(note);
};

const updateNote = async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  const { title, content, tags, color, isPinned } = req.body;
  if (title !== undefined)     note.title = title;
  if (content !== undefined)   note.content = content;
  if (tags !== undefined)      note.tags = tags;
  if (color !== undefined)     note.color = color;
  if (isPinned !== undefined)  note.isPinned = isPinned;

  const updated = await note.save();

  const io = req.app.get('io');
  emitToUser(io, req.user._id, 'note:updated', updated);

  res.json(updated);
};

const deleteNote = async (req, res) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  const io = req.app.get('io');
  // Only send the ID — the client uses it to remove from local state
  emitToUser(io, req.user._id, 'note:deleted', { id: req.params.id });

  res.json({ message: 'Note deleted', id: req.params.id });
};

module.exports = { getNotes, createNote, updateNote, deleteNote };