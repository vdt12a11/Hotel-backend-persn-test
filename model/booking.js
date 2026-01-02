const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    room: {
      type: Object, // hoặc bạn có thể ref tới Room nếu muốn quan hệ
      required: true,
    },
    formData: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      checkIn: { type: Date, required: true },
      checkOut: { type: Date, required: true },
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
    orderId: { type: String, unique: true },
    status: {
      type: String,
      enum: ["pending","booked", "checked_in", "checked_out","failed"],
      default: "pending",
    },
    checkedInAt: {
      type: Date,
      default: null
    },
    checkedOutAt: {
      type: Date,
      default: null
    },
    deeplink: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: () => new Date().toISOString(),
    }
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
