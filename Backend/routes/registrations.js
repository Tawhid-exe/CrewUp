import express from "express";
import checkToken from "../middlewares/checkToken.js";
import {
  getRegistrations,
  createRegistration,
  updateRegistration,
  deleteRegistration,
} from "../controller/registrationController.js";

const router = express.Router();

router.get("/", checkToken, getRegistrations);
router.post("/", checkToken, createRegistration);
router.put("/:id", checkToken, updateRegistration);
router.delete("/:id", checkToken, deleteRegistration);

export default router;
