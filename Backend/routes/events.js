import express from "express";
import checkToken from "../middlewares/checkToken.js";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controller/eventController.js";

const router = express.Router();

router.get("/", getEvents);

router.get("/:id", getEventById);

router.post("/", checkToken, createEvent);

router.put("/:id", checkToken, updateEvent);

router.delete("/:id", checkToken, deleteEvent);

export default router;
