const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],  // Only these 3 values allowed
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    linkedEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',     // Optional link to a calendar event
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Todo', todoSchema);