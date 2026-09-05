import { Schema, model } from "mongoose";

const registrationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  status: {
    type: Schema.Types.String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  role: {
    type: Schema.Types.String,
    default: "Volunteer",
  },
  skills: [Schema.Types.String],
});

const Registration = model("Registration", registrationSchema);
export default Registration;
