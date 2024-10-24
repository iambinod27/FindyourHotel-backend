const router = require("express").Router()
const Hotel = require("../../models/hotel");

router.post("/add", async (req, res) => {
    try {
        const hotel = new Hotel(req.body);
        await hotel.save();
        return res.status(200).send(hotel)
    } catch (error) {
        return res.status(200).send({ "error": error })
    }
});


router.get("/all", async (req, res) => {
    try {
        const getAllHotel = await Hotel.find();
        return res.status(200).send(getAllHotel);
    } catch (e) {
        return res.status(200).send({ "error": error })
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const hotel = await Hotel.findById(id);
        if (!hotel) {
            return res.status(404).send({ "error": "Hotel not found" });
        }
        return res.status(200).send(hotel);
    } catch (error) {
        return res.status(500).send({ "error": error.message });
    }
});

module.exports = router;