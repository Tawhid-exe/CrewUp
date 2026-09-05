import { Schema, model } from "mongoose";

const organizationSchema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  desc: Schema.Types.String,
  bio: Schema.Types.String,
  image: Schema.Types.String,
  events: {
    type: Schema.Types.Number,
    default: 0,
  },
  volunteers: Schema.Types.String,
  verified: {
    type: Schema.Types.Boolean,
    default: true,
  },
});

const Organization = model("Organization", organizationSchema);
export default Organization;