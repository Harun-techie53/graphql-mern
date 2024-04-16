const mongoose = require("mongoose");

//mongoose schema
const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
  },
  clientId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Client",
  },
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
