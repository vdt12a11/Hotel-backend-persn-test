    const Booking = require('../model/booking');

    const handleBooking = async (req, res) => {
        console.log("Đã vào booking controller");
        console.log(req.body);
    try {
        const { room, formData, searchData, totalPrice, userID,date } = req.body;
        console.log(room, formData,searchData, userID,date);
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
            date: date || new Date().toISOString()
        });

        console.log("Tạo booking thành công");
        res.status(201).json({ message: "Booking created", booking: newBooking });

    } catch (err) {
        console.log("Không tạo được booking:", err.message);
        res.status(500).json({ message: err.message });
    }
    }

    module.exports = { handleBooking };
