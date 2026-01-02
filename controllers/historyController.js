const Booking = require('../model/booking');

const getHistory = async (req, res) => {
    console.log("da vo history controller");
    console.log(req.params);
    try {
    const userID = req.params.userID; // hoặc từ req.user nếu dùng JWT
    console.log("UserId:", userID);
    if (!userID) return res.status(400).json({ message: "Missing userId" });
    const bookings = await Booking.find({ userID }).
    select({
        _id:1,
        "room.name": 1,
        "room.price": 1,
        "room.image": 1,
        "formData.name": 1,
        "formData.phone": 1,
        "formData.email": 1,
        "formData.checkIn": 1,
        "formData.checkOut": 1,
        orderId:1,
        totalPrice: 1,
        createdAt: 1,
        status:1
      }).sort({ date: -1 }); // mới nhất trước
    console.log("Bookings:", bookings);
    const formatted = bookings.map(b => ({
        ...b._doc,
        createdAt: new Date(b.createdAt).toLocaleString("vi-VN", {
            hour12: false
        })
    }));
    res.json(formatted);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}
const getHistoryUpcoming = async (req, res) => {
    console.log("da vo history upcoming");
    try {
        const userID = req.params.userID;
        console.log("UserId:", userID);
        if (!userID) return res.status(400).json({ message: "Missing userId" });

        const now = new Date().toISOString();
        const bookings = await Booking.find({
            userID,
            status: "booked",
            "formData.checkIn": { $gte: now } // assuming checkIn stored as ISO string or Date
        })
        .select({
            _id:1,
            "room.name": 1,
            "room.price": 1,
            "room.image": 1,
            "formData.name": 1,
            "formData.phone": 1,
            "formData.email": 1,
            "formData.checkIn": 1,
            "formData.checkOut": 1,
            orderId:1,
            totalPrice: 1,
            createdAt: 1,
            status:1
        })
        .sort({ "formData.checkIn": 1 }) // gần nhất trước
        .limit(3);

        const formatted = bookings.map(b => ({
            ...b._doc,
            createdAt: new Date(b.createdAt).toLocaleString("vi-VN", { hour12: false }),
            formData: {
                ...b.formData,
                checkIn: b.formData?.checkIn ? new Date(b.formData.checkIn).toLocaleString("vi-VN", { hour12: false }) : b.formData?.checkIn
            }
        }));

        res.json(formatted);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}
module.exports = { getHistory, getHistoryUpcoming };