const router = require("express").Router();
const Visitor = require("../models/visitors");

router.get("/", async (req, res) => {
    try {
        const visitors = await Visitor.find().populate("host_alloted");
        res.render("dashboard", { visitors: visitors });
    } catch(err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;