const router = require("express").Router();

router.get("/", (req, res) => {
    res.render("landing");
});

router.use("/visitor", require("./visitor"));
router.use("/host", require("./host"));

module.exports = router;