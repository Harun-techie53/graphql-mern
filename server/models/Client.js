const mongoose = require("mongoose");

//mongoose schema
const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
});

const Client = mongoose.model("Client", ClientSchema);

module.exports = Client;
