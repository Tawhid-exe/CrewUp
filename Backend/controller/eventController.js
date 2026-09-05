import Event from "../model/event.js";

const getDateRange = (dateFilter) => {
  if (dateFilter === "This Weekend") {
    const now = new Date();
    const day = now.getDay();
    const daysUntilSaturday = (6 - day + 7) % 7;
    const weekendStart = new Date(now);
    weekendStart.setDate(now.getDate() + daysUntilSaturday);
    weekendStart.setHours(0, 0, 0, 0);
    const weekendEnd = new Date(weekendStart);
    weekendEnd.setDate(weekendStart.getDate() + 2);
    weekendEnd.setSeconds(-1);
    return { $gte: weekendStart, $lte: weekendEnd };
  }

  if (dateFilter === "Next 30 Days") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 30);
    return { $gte: start, $lte: end };
  }

  return null;
};

const buildFilter = (query) => {
  const filter = {};

  const { categories, date, city, q, organizer } = query;

  if (organizer) {
    filter.organizer = organizer;
  }

  if (categories) {
    const list = categories
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    if (list.length > 0) {
      filter.category = { $in: list };
    }
  }

  const dateRange = getDateRange(date);
  if (dateRange) {
    filter.start_time = dateRange;
  }

  if (city) {
    const regex = new RegExp(city.trim(), "i");
    filter.$or = [{ location: regex }, { address: regex }];
  }

  if (q) {
    const regex = new RegExp(q.trim(), "i");
    const qClause = { $or: [{ title: regex }, { location: regex }] };
    if (filter.$or) {
      filter.$and = [qClause, { $or: filter.$or }];
      delete filter.$or;
    } else {
      filter.$or = qClause.$or;
    }
  }

  return filter;
};

export const getEvents = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const events = await Event.find(filter)
      .populate("organizer")
      .select("-__v")
      .sort({ start_time: 1 });
    return res.status(200).json(events);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({ id: Number(req.params.id) })
      .populate("organizer")
      .select("-__v");
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    return res.status(200).json(event);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const createEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    return res.status(201).json({ message: "Event created successfully" });
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const updateEvent = async (req, res) => {
  try {
    const updated = await Event.findOneAndUpdate(
      { id: Number(req.params.id) },
      req.body,
      { new: true },
    ).select("-__v");

    if (!updated) {
      return res.status(404).json({ error: "Event not found" });
    }
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findOneAndDelete({ id: Number(req.params.id) });
    if (!deleted) {
      return res.status(404).json({ error: "Event not found" });
    }
    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    return res.status(400).json(err);
  }
};
