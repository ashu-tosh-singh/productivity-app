const Note = require('../models/Note');

// ── GET /api/notes ──────────────────────────────────────────────
// Get all notes for the logged-in user
const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user._id })
    .sort({ isPinned: -1, updatedAt: -1 }); 
    // Pinned notes first, then most recently updated

  res.json(notes);
};

// ── POST /api/notes ─────────────────────────────────────────────
// Create a new note
const createNote = async (req, res) => {
  const { title, content, tags, color, isPinned } = req.body;

  const note = await Note.create({
    user: req.user._id,   // Always tie to the logged-in user
    title,
    content,
    tags,
    color,
    isPinned,
  });

  res.status(201).json(note);
};

// ── PUT /api/notes/:id ──────────────────────────────────────────
// Update a note — only if it belongs to the logged-in user
const updateNote = async (req, res) => {
  const note = await Note.findOne({
    _id: req.params.id,
    user: req.user._id,   // Double-check ownership — NEVER skip this
  });

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  const { title, content, tags, color, isPinned } = req.body;

  // Only update fields that were actually sent
  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;
  if (tags !== undefined) note.tags = tags;
  if (color !== undefined) note.color = color;
  if (isPinned !== undefined) note.isPinned = isPinned;

  const updated = await note.save(); // save() triggers timestamps update
  res.json(updated);
};

// ── DELETE /api/notes/:id ───────────────────────────────────────
const deleteNote = async (req, res) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  res.json({ message: 'Note deleted', id: req.params.id });
};

module.exports = { getNotes, createNote, updateNote, deleteNote };