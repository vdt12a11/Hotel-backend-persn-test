const Booking = require('../model/booking');

const handleBooking = async (req, res) => {
try {
    const { room, formData,  totalPrice, userID,date } = req.body;
    console.log(room, formData, userID,date);
    // Kiểm tra dữ liệu
    if (!room || !formData || !userID) {
        console.log("Thiếu dữ liệu bắt buộc");
        return res.status(400).json({ message: "Missing required fields" });
    }
    // Tạo object booking
    const newBooking = await Booking.create({
        userID,
        room,
        formData,
        totalPrice,
        date:date || new Date().toISOString()
    });

    console.log("Tạo booking thành công");
    res.status(201).json({ message: "Booking created", booking: newBooking });

} catch (err) {
    console.log("Không tạo được booking:", err.message);
    res.status(500).json({ message: err.message });
}
}

const checkInBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.find({id});
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "booked") {
      return res.status(400).json({
        message: "Booking cannot be checked in"
      });
    }

    booking.status = "checked_in";
    booking.checkedInAt = new Date();

    await booking.save();

    res.json({
      message: "Check-in thành công"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const checkOutBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.find({id});
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "checked_in") {
      return res.status(400).json({
        message: "Booking chưa check-in"
      });
    }

    booking.status = "checked_out";
    booking.checkedOutAt = new Date();

    await booking.save();

    res.json({
      message: "Check-out thành công"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = { handleBooking,checkInBooking,checkOutBooking };