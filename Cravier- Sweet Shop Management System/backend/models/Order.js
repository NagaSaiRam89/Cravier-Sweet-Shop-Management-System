const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String }, // Snapshot of name at time of order
  items: [{
    sweetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sweet' },
    sweetName: String,
    quantity: Number,
    pricePerUnit: Number
  }],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'completed' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);