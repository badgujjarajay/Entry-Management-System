const router = require("express").Router();

router.get("/", (req, res) => {
    res.render("landing");
});

router.use("/visitor", require("./visitor"));
router.use("/host", require("./host"));
router.use("/dashboard", require("./dashboard"));
router.use("/admin", require("./admin"));

module.exports = router;