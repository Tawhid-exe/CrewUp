import Organization from "../model/organization.js";

export const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find().select("-__v");
    return res.status(200).json(organizations);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id).select("-__v");
    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }
    return res.status(200).json(organization);
  } catch (err) {
    return res.status(400).json(err);
  }
};