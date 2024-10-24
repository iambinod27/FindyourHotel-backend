const express = require("express");
const mongoose = require("mongoose")

const User = require("../../models/user")
const Hotel = require("../../models/hotel")
const Booking = require("../../models/booking")
const router = express.Router();

router.post("/add", async (req, res) => {
    try {
        const { userEmail, hotelId, checkInDate, checkOutDate, roomType, numberOfGuests, totalPrice } = req.body

        console.log(req.body)

        const user = await User.findOne({ email: userEmail })

        if (!user) {
            return res.status(200).json({ success: false, message: "User not found" })
        }

        if (!mongoose.Types.ObjectId.isValid(hotelId)) {
            return res
                .status(200)
                .json({ success: false, message: "Invalid hotel ID format" });
        }

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res
                .status(404)
                .json({ success: false, message: "Hotel not found" });
        }

        const newBooking = new Booking({
            user: user._id,
            hotelId: hotel._id,
            hotelName: hotel.name,
            checkInDate,
            checkOutDate,
            totalPrice,
            roomType,
            numberOfGuests,
        });

        const savedBooking = await newBooking.save();
        res.status(201).json({ success: true, booking: savedBooking, message: "Booking successful we will contact you in shortly to confirm" });
    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({
            success: false,
            message: "Error creating booking",
            error: error.message,
        });
    }
})

module.exports = router;
