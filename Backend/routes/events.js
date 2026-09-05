import express from "express";
import { getEvents, getEventById } from "../controller/eventController.js";

const router = express.Router();

router.get("/", getEvents);

router.get("/:id", getEventById);

export default router;