const Booking = require('../model/booking');
const User = require('../model/user');
const cron = require('node-cron');
const paymentController = require('../controllers/paymentController');
cron.schedule('* * * * *', async () => {  // chạy mỗi phút
  const oneHourAgo = new Date(Date.now() - 60*60*1000);
  await Booking.updateMany(
    { status: 'pending', createdAt: { $lte: oneHourAgo } },
    { status: 'expired' }
  );
  console.log('Checked bookings at', new Date());
});
const handleBooking = async (req, res) => {
  const { room, formData,  totalPrice, userID,date } = req.body;
  try {
      totalPrices=20000;
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
      const orderId = `MOMO${newBooking._id}${Date.now()}`;
       newBooking.orderId = orderId;
      await newBooking.save();
      const user = await User.findById(userID);
      if(user.linkingWallet == "false"){
        return res.status(400).json({ message: "User chua lien ket vi" });
      }
      const momoRes = await paymentController.createPayment({
        orderId,
        amount: totalPrices
      });
      console.log(momoRes);
      console.log("Tạo booking thành cônggg");
      return res.status(201).json({
      bookingId: newBooking._id,
      orderId,
      deeplink: momoRes.deeplink,
      status: 'pending',
    });
  } catch (err) {
      console.log("Không tạo được booking:", err.message);
      res.status(500).json({ message: err.message });
  }
}

const checkInBooking = async (req, res) => {
  
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id);
    console.log(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    console.log(booking);
    if (booking.status !== "booked") {
      return res.status(400).json({
        message: "Booking cannot be checked in"
      });
    }

    booking.status = "checked_in";
    booking.checkedInAt = new Date().toISOString();

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

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "checked_in") {
      return res.status(400).json({
        message: "Booking chưa check-in"
      });
    }

    booking.status = "checked_out";
    booking.checkedOutAt = new Date().toISOString();

    await booking.save();

    res.json({
      message: "Check-out thành công"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = { handleBooking,checkInBooking,checkOutBooking };