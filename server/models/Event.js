const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    date: {
      type: Date,       // The event date
      required: [true, 'Event date is required'],
    },
    endDate: {
      type: Date,       // Optional end date for multi-day events
      default: null,
    },
    color: {
      type: String,
      default: 'indigo', // Color tag for calendar display
    },
    linkedTodos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo',    // Tasks linked to this event
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);