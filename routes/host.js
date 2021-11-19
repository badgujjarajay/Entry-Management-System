const router = require("express").Router();
const { getRenderData } = require("../controllers/utils");
const { addHost } = require("../controllers/host");
router.get("/", async (req, res) => {
    res.render("host", getRenderData(req));
});

router.post("/", addHost);

module.exports = router;