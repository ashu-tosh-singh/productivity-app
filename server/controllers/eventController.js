const Event = require('../models/Event');
const { emitToUser } = require('../socket/socketHandler');

const getEvents = async (req, res) => {
  const filter = { user: req.user._id };

  if (req.query.month) {
    const [year, month] = req.query.month.split('-').map(Number);
    filter.date = {
      $gte: new Date(year, month - 1, 1),
      $lte: new Date(year, month, 0, 23, 59, 59),
    };
  }

  const events = await Event.find(filter)
    .populate('linkedTodos', 'title isCompleted priority')
    .sort({ date: 1 });

  res.json(events);
};

const createEvent = async (req, res) => {
  const { title, description, date, endDate, color, linkedTodos } = req.body;

  if (!title || !date) {
    res.status(400);
    throw new Error('Title and date are required');
  }

  const event = await Event.create({
    user: req.user._id,
    title, description, date, endDate, color, linkedTodos,
  });

  const io = req.app.get('io');
  emitToUser(io, req.user._id, 'event:created', event);

  res.status(201).json(event);
};

const updateEvent = async (req, res) => {
  const event = await Event.findOne({ _id: req.params.id, user: req.user._id });

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  const { title, description, date, endDate, color, linkedTodos } = req.body;
  if (title !== undefined)        event.title = title;
  if (description !== undefined)  event.description = description;
  if (date !== undefined)         event.date = date;
  if (endDate !== undefined)      event.endDate = endDate;
  if (color !== undefined)        event.color = color;
  if (linkedTodos !== undefined)  event.linkedTodos = linkedTodos;

  const updated = await event.save();

  const io = req.app.get('io');
  emitToUser(io, req.user._id, 'event:updated', updated);

  res.json(updated);
};

const deleteEvent = async (req, res) => {
  const event = await Event.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  const io = req.app.get('io');
  emitToUser(io, req.user._id, 'event:deleted', { id: req.params.id });

  res.json({ message: 'Event deleted', id: req.params.id });
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };