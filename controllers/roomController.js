const Room = require('../model/room');

const getAllRoom = async (req, res) => {
    const rooms = await Room.find();
    if (!rooms) return res.status(204).json({ 'message': 'No employees found.' });
    res.json(rooms);
}

const createNewRoom = async (req, res) => {
    // if (!req?.body?.firstname || !req?.body?.lastname) {
    //     return res.status(400).json({ 'message': 'First and last names are required' });
    // }

    try {
        const { name, price,image, size, bed, view, capacity } = req.body;

        if (!name || !image || !price|| !size|| !bed|| !view|| !capacity) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newRoom = await Room.create({ name , price, image, size, bed, view, capacity });
        res.status(201).json({ message: "Room added", room: newRoom });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}
const getRoom = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const room = await Room.findOne({ _id: req.params.id }).exec();
    if (!room) {
        return res.status(204).json({ "message": `No room matches ID ${req.params.id}.` });
    }
    res.json(room);
}


module.exports = {
    getAllRoom,
    createNewRoom,
    getRoom
}
