import Registration from "../model/registration.js";

export const getRegistrations = async (req, res) => {
  try {
    const filter = {};
    if (req.query.event) {
      filter.event = req.query.event;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const registrations = await Registration.find(filter)
      .populate("user", ["-password", "-__v"])
      .populate("event", "-__v")
      .select("-__v");

    return res.status(200).json(registrations);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const createRegistration = async (req, res) => {
  try {
    const newRegistration = new Registration(req.body);
    await newRegistration.save();
    return res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const updateRegistration = async (req, res) => {
  try {
    const updated = await Registration.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true },
    ).select("-__v");

    if (!updated) {
      return res.status(404).json({ error: "Registration not found" });
    }
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const deleteRegistration = async (req, res) => {
  try {
    const deleted = await Registration.findOneAndDelete({ _id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ error: "Registration not found" });
    }
    return res.status(200).json({ message: "Registration removed" });
  } catch (err) {
    return res.status(400).json(err);
  }
};
