const mongoose = require('mongoose');

const pcbuildsSchema = new mongoose.Schema({
  category: { type: String, required: true },
  id: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  specs: { type: String, required: true },
  brand: { type: String, required: true },
});

const pcbuildsModel = mongoose.model('PCBuild', pcbuildsSchema);
module.exports = pcbuildsModel;
