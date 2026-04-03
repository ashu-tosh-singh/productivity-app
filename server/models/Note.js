const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',       // Links to User collection
      required: true,    // Every note MUST belong to a user
    },
    title: {
      type: String,
      default: 'Untitled',
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],    // Array of strings e.g. ['work', 'ideas']
      default: [],
    },
    color: {
      type: String,
      default: 'default', // Used for note card color coding
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }   // createdAt + updatedAt auto-managed
);

module.exports = mongoose.model('Note', noteSchema);