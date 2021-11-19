const router = require("express").Router();
const Host = require("../models/hosts");
const { getRenderData } = require("../controllers/utils");
const { checkinVisitor } = require("../controllers/visitor");

router.get("/checkin", async (req, res) => {
    const hosts = await Host.find();
    res.render("visitor_checkin", { ...getRenderData(req), hosts });
});

router.get("/checkout", async (req, res) => {
    res.render("visitor_checkout", getRenderData(req));
});

router.post("/checkin", checkinVisitor);

module.exports = router;